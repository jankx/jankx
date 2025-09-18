<?php

namespace App\Services;

class SkeletonService
{
    protected $skeletonUrl;

    public function __construct($skeletonUrl)
    {
        $this->skeletonUrl = $skeletonUrl;
    }

    public function getSkeletonUrl()
    {
        return $this->skeletonUrl;
    }
}
