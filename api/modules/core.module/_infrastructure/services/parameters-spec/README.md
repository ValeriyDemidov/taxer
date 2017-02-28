# node-parameters-spec
NPM module. Mongoose-like parameters validator. Allows to create parameters spec with specifying types and default values.

## Usage
Importing dependencies
```
    const ParameterSpec = require('parameter-spec');
```

Instantinate validator with specification object
```
    const _validator = new ParameterSpec({
        // key is a parameter name
        callback: {
            // parameter type class
            type: Function,
            // parameter default value
            default: function () {}
        },
        amount: {
            type: Number,
            default: 1
        },
        message: {
            type: String
        }
    });
```

Using `_validator` fot options object handling **(1)** or single option validation **(2)**.
```
    class MyClass {
        constructor(options) {
            // validates options and extends with default values
            this.opt = _validator.applyParameters(options);                // 1
            try {
                // validator throws errors if parameter is invalid
                this.opt.amount = _validator.validateParameter('Bad one'); // 2
            } catch (e) {
                console.error('Attempting to add invalid parameter');
            }

        }
    }
```
