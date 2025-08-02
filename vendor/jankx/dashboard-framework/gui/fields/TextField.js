import Field from './Field';
import { Input } from '@chakra-ui/react';

export default class TextField extends Field {
    render(formData) {
        const value = this.getValue(formData);

        return (
            <Input
                key={this.id}
                label={this.field.title}
                value={value}
                onChange={(e) => this.onChange(this.id, e.target.value)}
                fullWidth
                margin="normal"
            />
        );
    }
}