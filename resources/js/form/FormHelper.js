export default  class FormHelper {

    static inputClassName(inputState){
        let className = 'form-control';

        if (inputState === null) {
            className += '';
        } else if (inputState === '') {
            className += ' is-valid';
        } else if (inputState !== '') {
            className += ' is-invalid';
        }
        return className;
    }

    static feedbackClass(inputState){
        let className = '';

        if (inputState === '' || inputState === null) {
            className = 'valid-feedback';
        } else if (inputState !== '') {
            className = 'invalid-feedback';
        }
        return className;
    }

    static updateFormErrors(formErrorsState, responseErrors){

        for (const [key, value] of Object.entries(formErrorsState)) {
            if (key in responseErrors) {
                formErrorsState[key] = responseErrors[key];
            } else {
                formErrorsState[key] = '';
            }
        }
        return formErrorsState;
    }

    static handleInputChangeNewValue(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        return {[name]: value};

    }

   

}