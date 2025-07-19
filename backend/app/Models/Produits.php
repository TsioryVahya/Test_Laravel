<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produits extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image_url', 'description', 'price', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
