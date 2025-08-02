import TextField from './TextField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import ImageField from './ImageField';
import IconField from './IconField';

export default class FieldFactory {
    static create(id, field, onChange) {
        switch (field.type) {
            case 'text':
            case 'input':
                return new TextField(id, field, onChange);
            case 'textarea':
                return new TextareaField(id, field, onChange);
            case 'select':
                return new SelectField(id, field, onChange);
            case 'image':
                return new ImageField(id, field, onChange);
            case 'icon':
                return new IconField(id, field, onChange);
            default:
                console.warn(`Unsupported field type: ${field.type}`);
                return null;
        }
    }
}