import logger from 'utils/logger';
import { dset } from 'dset';
import delve from 'dlv';

const isJSON = (value: string) => {
    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    return true;
}
class _localStorage {
    constructor() {
        return this;
    }

    isJSON (value: string) {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    }

    static get (key: string): null | boolean | number | any[] | object {
        const me = new _localStorage();
        const _value = localStorage.getItem(key);

        if (!_value) return null;
        if ( ['false', 'true'].includes(_value) ) {
            return _value === 'true' ? true : false;
        } else if ( !isNaN(_value as any) && _value !== '' ) {
            return Number(_value);
        } else if (me.isJSON(_value)) {
            return JSON.parse(_value);
        } else {
            throw new Error(`key '${key} is not mapped to an unexpected value`);
        }

    }

    static getBoolean (key: string): boolean | null {
        const _value = _localStorage.get(key);
        if ( typeof _value === 'boolean' || _value == null ) return _value;
        else throw new Error(`key '${key} is not mapped to a boolean`);
    }

    static set (key: string, value: any) {
        if ( ['string', 'bigint', 'number'].includes(typeof value) ) {
            localStorage.setItem(key, value);
        } else if ( value === true || value === false ) {
            localStorage.setItem(key, value.toString());
        } else if ( value instanceof Array || value instanceof Object ) {
            const _value: string =  JSON.stringify(value)
            localStorage.setItem(key, _value);
        } else { 
            throw new Error(`unsupported type: ${typeof value}`);
        }
        return value;
    }

    static add (key: string, value: string | number | object) {
        let _value = _localStorage.get(key);
        if (!_value) _value = [];
        if ( _value instanceof Array ) {
            _value.push(value);
        } else throw new Error(`key '${key} is not mapped to an array`);
        _localStorage.set(key, _value);
        return _value;
    }

    static remove (key: string, value: string | number | object): any[] {
        let _value = _localStorage.get(key);
            // found = false;
        // Init as empty array
        if (!_value) _value = [];
        if ( _value instanceof Array ) {
            _value = _value.filter( v => v !== value );
            _value
        } else throw new Error(`key '${key} is not mapped to an array`);
        _localStorage.set(key, _value);
        return _value as any[];
    }

    static objectSet (key: string, path: string, value: any) {
        let _value = _localStorage.get(key);
        if ( _value instanceof Object ) {
            dset(_value, path, value);
            _localStorage.set(key, _value);
        } else throw new Error(`key '${key} is not mapped to an object`);
        return _value;
    }

    static objectGet (key: string, path: string) {
        let _value = _localStorage.get(key);
        if ( _value instanceof Object ) {
            const value = delve(_value, path);
            return value;
        } else throw new Error(`key '${key} is not mapped to an object`);
    }
}

export default _localStorage;