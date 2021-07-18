<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    const IMAGE_PATH = 'articles/';
    const IMAGE_URL = '/storage/articles/';

    protected $guarded = ['id'];

    public function labels(){
        return $this->belongsToMany('App\Models\Label');
    }

    public function user()
    {
        return $this->belongsTo('App\Model\User');
    }

    public function getImagePathAttribute()
    {

        return !is_null($this->image)?  self::IMAGE_PATH . $this->image : null;
    }
}
