import Field from './Field';
import { Select } from '@chakra-ui/react';

export default class SelectField extends Field {
    render(formData) {
        const value = this.getValue(formData);

        return (
            <Select
                key={this.id}
                placeholder={this.field.title}
                value={value}
                onChange={this.handleChange}
            >
                {this.field.options && Object.entries(this.field.options).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </Select>
        );
    }
}