function ajax(params, btn, response) {

    let xhr = new XMLHttpRequest();
    xhr.open("POST", params.url);
    xhr.send(params.data);

    xhr.onload = function () {
        response(xhr.status, xhr.response);
    };

    xhr.onerror = function () {
        console.error("Ошибка соединения");
    };

    xhr.onreadystatechange = function () {


        if (xhr.readyState == 3) {
            btn.classList.add("btn-loading");
        }

        if (xhr.readyState == 4) {
            setTimeout(function () {
                btn.classList.remove("btn-loading");
            }, 500);

        }

    };
}

function state(type_err, message) {

    if (!document.querySelector("#status")) {
        var elem = document.createElement("div");
        elem.setAttribute("id", "status");
        document.body.append(elem);
    }

    document.querySelector("#status").classList.remove("complete");
    document.querySelector("#status").classList.remove("error");

    if (type_err) {
        document.querySelector("#status").classList.add("complete");
        document.querySelector("#status").innerHTML = message;

    } else {
        document.querySelector("#status").classList.add("error");
        document.querySelector("#status").innerHTML = message;
    }

    setTimeout(function () {
        document.querySelector("#status").classList.remove("complete");
        document.querySelector("#status").classList.remove("error");
    }, 8000);


}

document.querySelectorAll("[data-form]").forEach(function (item) {
    item.addEventListener("submit", function (event) {
        event.preventDefault();

        let _this = this;
        let formData = new FormData(this);
        let btn = this.querySelector(".btn");

        ajax({url: this.getAttribute("action"), data: formData}, btn, function (status, response) {

            let dataResponse = JSON.parse(response);

            switch (dataResponse["status"]) {

            case "mail_sent":
                _this.reset();
                state(true, dataResponse["message"]);

                _this.querySelectorAll(".err").forEach(function (input) {
                    input.classList.remove("err");
                });

                break;

            case "validation_failed":
                state(false, dataResponse["message"]);

                _this.querySelectorAll(".err").forEach(function (input) {
                    input.classList.remove("err");
                });

                dataResponse["invalid_fields"].forEach(function (item) {
                    let id_field = item["error_id"].replace("-ve-", "");
                    console.log(id_field);
                    _this.querySelector("[name=\"" + id_field + "\"]").classList.add("err");
                });

                break;

            default:
                state(false, "Вы должны подтвердить своё согласие на обработку персональных данных.");

            }

            console.log(dataResponse);
        });

    });
});