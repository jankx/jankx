<?php

namespace Jankx\Dashboard\Elements\Fields;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Dashboard\Elements\Field;
use Jankx\Dashboard\Interfaces\Fields\TextareaFieldInterface;

class TextareaField extends Field implements TextareaFieldInterface
{
    protected $type = 'textarea';
}
