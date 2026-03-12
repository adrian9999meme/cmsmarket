<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteResource\UserMessageResource;
use App\Repositories\Admin\Addon\ChatSystemRepository;
use App\Traits\ApiReturnFormatTrait;
use App\Traits\ImageTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    use ApiReturnFormatTrait, ImageTrait;

    protected $chatSystemRepository;

    public function __construct(ChatSystemRepository $chatSystemRepository)
    {
        $this->chatSystemRepository = $chatSystemRepository;
    }

    /**
     * Get chat rooms for CMS user (admin sees all, seller sees their conversations).
     */
    public function rooms(Request $request)
    {
        try {
            $user = authUser($request);
            if (!$user) {
                return $this->responseWithError(__('Unauthorized'), [], 401);
            }

            $rooms = $this->chatSystemRepository->cmsChatRooms($user, $request->all());

            $data = collect($rooms->items())->map(function ($room) use ($user) {
                $other = $room->user_id === $user->id ? $room->receiver : $room->user;
                $lastMessage = $room->lastMessage;
                return [
                    'id' => $room->id,
                    'roomId' => $room->id,
                    'chat_room_id' => $room->id,
                    'name' => $other ? ($other->first_name . ' ' . $other->last_name) : 'Unknown',
                    'user_name' => $other ? ($other->first_name . ' ' . $other->last_name) : 'Unknown',
                    'status' => 'online',
                    'image' => $other && $other->image ? static_asset($other->image) : null,
                    'description' => $lastMessage ? $lastMessage->message : '',
                    'time' => $lastMessage ? $lastMessage->created_at->diffForHumans() : '',
                ];
            });

            return $this->responseWithSuccess(__('Chat rooms retrieved'), [
                'data' => $data,
                'total' => $rooms->total(),
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get messages for a chat room.
     */
    public function messages(Request $request)
    {
        DB::beginTransaction();
        try {
            $chat_room = $this->chatSystemRepository->find($request->chat_room_id);

            if (!$chat_room) {
                return $this->responseWithError(__('No Conversation Found'), [], 404);
            }

            $messages = $this->chatSystemRepository->userMessages($chat_room);

            $data = [
                'messages' => new UserMessageResource($messages),
            ];

            DB::commit();
            return $this->responseWithSuccess(__('Conversation Retrieved'), $data);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Send a message.
     */
    public function sendMessage(Request $request)
    {
        $validator = validator($request->all(), [
            'msg' => 'required_without:file',
            'file' => 'required_without:msg',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()], 422);
        }

        try {
            $user = authUser($request);
            if (!$user) {
                return $this->responseWithError(__('Unauthorized'), [], 401);
            }

            $data = $request->all();
            $data['user_id'] = $user->id;

            $chatroom = null;
            if ($request->chat_room_id) {
                $chatroom = $this->chatSystemRepository->find($request->chat_room_id);
            }
            if (!$chatroom && $request->receiver_id) {
                $chatroom = $this->chatSystemRepository->findChatRoom([
                    'user_id' => $user->id,
                    'receiver_id' => $request->receiver_id,
                ]);
            }
            if (!$chatroom && $request->receiver_id) {
                $chatroom = $this->chatSystemRepository->createChatroom([
                    'user_id' => $user->id,
                    'receiver_id' => $request->receiver_id,
                ]);
            }
            if (!$chatroom) {
                return $this->responseWithError(__('Chat room or receiver required'), [], 422);
            }

            $msg = $request->msg;
            $file_type = '';
            $file_path = '';

            if ($request->hasFile('file')) {
                $msg = $request->file('file')->getClientOriginalName();
                $file_type = $request->file('file')->getMimeType();
                $file_path = $this->saveFile($request->file('file'), $file_type, false);
            }

            $message = $this->chatSystemRepository->sendMessage([
                'chat_room_id' => $chatroom->id,
                'message' => $msg,
                'type' => 1,
                'is_file' => $request->hasFile('file'),
                'file_type' => $file_type,
                'file' => $file_path,
            ]);

            return $this->responseWithSuccess(__('Message Sent Successfully'), [
                'id' => $message->id,
                'to_id' => 2,
                'msg' => $msg,
                'time' => $message->created_at->format('H:i'),
                'isImages' => false,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
