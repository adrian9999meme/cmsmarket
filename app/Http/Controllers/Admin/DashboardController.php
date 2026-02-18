<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\Admin\DashboardInterface;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private $dashboard;

    public function __construct(DashboardInterface $dashboard)
    {
        $this->dashboard = $dashboard;
    }

    public function index()
    {
        $data = $this->dashboard->index();
        return view('admin.dashboard',$data);
    }

    protected function orderStatistics($report_type){
        try{
            return $this->dashboard->orderStatistics($report_type, false);
        } catch (\Exception $e){
            return $e->getMessage();
        }
    }

    protected function orderState($report_type){
        try{
            return $this->dashboard->orderState($report_type, false);
        } catch (\Exception $e){
            return $e->getMessage();
        }
    }

    protected function salesByCategory($report_type){
        try{
            return $this->dashboard->salesByCategory($report_type, false);
        } catch (\Exception $e){
            return $e->getMessage();
        }
    }

    protected function salesState($report_type){
        try{
            return $this->dashboard->salesState($report_type, false);
        } catch (\Exception $e){
            return $e->getMessage();
        }
    }

    protected function topProducts($report_type){
        try{
            return $this->dashboard->topProducts($report_type, false);
        } catch (\Exception $e){
            return $e->getMessage();
        }
    }
}
