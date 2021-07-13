<?php

namespace App\Services;

use App\Models\User;

class UserService
{

    public static function generateToken(User $user)
    {
        return $user->id . bin2hex(random_bytes(45));
    }
}
