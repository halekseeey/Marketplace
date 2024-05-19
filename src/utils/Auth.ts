import {ObservableValue} from './ObservableValue';

export class Auth extends ObservableValue<boolean> {
    constructor(theme = false) {
        super(theme);
    }
}