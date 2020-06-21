const utils = {
    isNullOrEmpty: function (text) {
        return (text) ? (text.toString().match(/^ *$/) !== null) : true;
    },
    tryGet: function (func) {
        try {
            var value = func();
            if (value) {
                return value;
            }
            else {
                return undefined;
            }
        } catch (e) {
            return undefined;
        }
    }
};

export default utils
