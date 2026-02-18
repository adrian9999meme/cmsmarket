<?php

namespace App\Utility;

use App\Models\StoreCategory;

class StoreCategoryUtility
{
    public static function childs($id)
    {
        $childs = StoreCategoryUtility::shiblings($id);

        return !empty($childs) ? array_column($childs, 'id') : [];
    }

    public static function shiblings($id, $return_type = array())
    {
        $childs = StoreCategoryUtility::getMyChilds($id);
        if (!empty($childs)) :
            foreach ($childs as $child) :
                $return_type[] = $child;
                $return_type = StoreCategoryUtility::shiblings($child['id'], $return_type);
            endforeach;
        endif;

        return $return_type;
    }

    public static function getMyChilds($id, $array = false,$active_data=false)
    {
        $childs = StoreCategory::where('parent_id', $id)->when($active_data,function ($query){
            $query->where('status',1);
        })->get();
        $childs = $array && !empty($childs) ? $childs->toArray() : [];

        return $childs;
    }

    public static function getMyChildIds($id)
    {
        $childs = StoreCategoryUtility::getMyChilds($id,true);

        return !empty($childs) ? array_column($childs, 'id') : [];
    }

    public static function position($id, $up = true)
    {
        if (!empty(StoreCategoryUtility::getMyChildIds($id))) :
            foreach (StoreCategoryUtility::getMyChildIds($id) as $value) :
                $category = StoreCategory::find($value);
                $category->position = $up ? $category->position + 1 : $category->position - 1;
                $category->save();

                return StoreCategoryUtility::position($value, $up);
            endforeach;
        endif;
    }

    public static function getMyAllChildIds($id,$active_data=false)
    {
        $childs = StoreCategoryUtility::getMyChilds($id,true,$active_data);

        $data = !empty($childs) ? array_column($childs, 'id') : [];
        $new_data[] = $data;

        foreach ($data as $child):
            $children = StoreCategoryUtility::getMyChildIds($child);
            if($children != []):
                $new_data[] = StoreCategoryUtility::getMyChildIds($child);
            endif;
        endforeach;


        return array_merge(...$new_data);
    }
}
