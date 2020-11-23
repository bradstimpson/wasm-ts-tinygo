import * as React from 'react';

type Props = {
    value: string | number,
    onChange: any,
}

const NumberInput = ({ value, onChange }: Props) => (
    <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} />
);

export default NumberInput