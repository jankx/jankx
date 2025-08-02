<?php

namespace Jankx\Dashboard\Factories;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Dashboard\Elements\Fields\SelectField;
use Jankx\Dashboard\Elements\Fields\TextareaField;
use Jankx\Dashboard\Elements\Fields\TextField;
use Jankx\Dashboard\Elements\Fields\ImageField;
use Jankx\Dashboard\Elements\Fields\IconField;

class FieldFactory
{
    protected static function createTextField($id, $title, $args)
    {
        $textField = new TextField($id, $title, $args);

        return $textField;
    }


    /**
     * Summary of create field
     *
     * @param mixed $id
     * @param mixed $title
     * @param mixed $type
     * @param mixed $args
     * @return \Jankx\Dashboard\Elements\Field|null
     */
    public static function create($id, $title, $type, $args)
    {
        switch ($type) {
            case 'text':
            case 'input':
                return static::createTextField($id, $title, $args);

            case 'textarea':
                return static::createTextareaField($id, $title, $args);

            case 'select':
            case 'dropdown':
            case 'option':
                return static::createSelectField($id, $title, $args);

            case 'image':
                return static::createImageField($id, $title, $args);

            case 'icon':
                return static::createIconField($id, $title, $args);
        }

        return null;
    }

    protected static function createTextareaField($id, $title, $args)
    {
        $textareaField = new TextareaField($id, $title, $args);

        return $textareaField;
    }

    protected static function createSelectField($id, $title, $args)
    {
        $selectField = new SelectField($id, $title, $args);

        return $selectField;
    }

    protected static function createImageField($id, $title, $args)
    {
        return new ImageField($id, $title, $args);
    }

    protected static function createIconField($id, $title, $args)
    {
        return new IconField($id, $title, $args);
    }
}
