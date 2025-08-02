import Field from './Field';
import { Textarea } from '@chakra-ui/react';

export default class TextareaField extends Field {
    render(formData) {
        const value = this.getValue(formData);

        return (
            <Textarea
                key={this.id}
                placeholder={this.field.title}
                value={value}
                onChange={this.handleChange}
            />
        );
    }
}