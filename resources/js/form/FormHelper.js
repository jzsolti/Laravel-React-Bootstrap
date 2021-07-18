export default class FormHelper {

    static inputClassName(inputErrorState, className = 'form-control') {


        if (typeof inputErrorState === 'undefined') {
            return className;
        }

        if (inputErrorState === null) {
            className += '';
        } else if (inputErrorState === '') {
            className += ' is-valid';
        } else if (inputErrorState !== '') {
            className += ' is-invalid';
        }
        return className;
    }

    static feedbackClass(inputState, className = '') {

        if (inputState === '' || inputState === null) {
            className = 'valid-feedback';
        } else if (inputState !== '') {
            className = 'invalid-feedback';
        }
        return className;
    }

    static updateFormErrors(formErrorsState, responseErrors) {

        for (const [key, value] of Object.entries(formErrorsState)) {
            if (key in responseErrors) {
                formErrorsState[key] = responseErrors[key];
            } else {
                formErrorsState[key] = '';
            }
        }
        return formErrorsState;
    }

    static handleInputChangeNewValue(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        return { [name]: value };
    }

    static getFormData(inputs, state, additional = {}) {
        let formData = new FormData();

        inputs.forEach((item) => {
            if (typeof state[item] === 'object' && Array.isArray(state[item])) {
                state[item].forEach((arrayItem) => {
                    formData.append(item + '[]', arrayItem);
                });
            } else {
                formData.append(item, state[item]);
            }
        });

        for (const [key, value] of Object.entries(additional)) {
            formData.append(key, value);
        }

        return formData;
    }

    static resetValidation(inputs) {
        let formErrors = {};
        inputs.forEach((item) => {
            formErrors[item] = null;
        });
        return formErrors;
    }

}