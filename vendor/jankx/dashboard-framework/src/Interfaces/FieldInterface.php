<?php

namespace Jankx\Dashboard\Interfaces;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

interface FieldInterface
{
    public function getId();

    public function getType();

    public function getTitle();

    public function getArgs();
}
