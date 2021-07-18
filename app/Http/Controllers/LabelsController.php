<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Label;
use App\Http\Resources\LabelsResource;

class LabelsController extends Controller
{
    public function index()
    {
        return LabelsResource::collection(Label::orderBy('name')->get());
    }
}
