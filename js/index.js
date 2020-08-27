$(function () {

    function GetUrlParam(paraName) {
        var url = document.location.toString();
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        }
        else {
            return "";
        }
    }

    let count = 120;
    $('.code').on('click', function () {
        let tel = $('#tel').val();
        validationNow(tel);
    });
    let Broker = GetUrlParam("BorkerID");
    // let host = '139.129.39.75';
    let host = window.location.host;
    let by = window.location.search.split('&')[1].split('=')[1];
    console.log('地址',host,by);
    $('#brokerId').val(Broker);
    $('.submit').on('click', function () {
        let tel = $('#tel').val();
        let code = $('#code').val();
        console.log(code);
        let username = $('#username').val();
        let password = $('#password').val();
        let repassword = $('#repassword').val();
        let id = $('select option:selected')[0].id;
        let option = {
            "Mobile": tel,
            "Code": code,
            BrokerID: Broker,
            UserAccountName: username,
            Password: password,
            RePassword: repassword,

        }
        let smalloption = {
            strengthen: '',
            general: '',
            link: ''
        }
        for (let key in smalloption) {
            if (key == id) {
                smalloption[key] = 1
                option[key] = smalloption[key];
            } else {
                smalloption[key] = 0
                option[key] = smalloption[key];
            }
        }
        console.log('我是数据', option)
        $.ajax({
            type: "post",
            url: "http://" + host + "/app/reg",
            data: option,
            success: function (result) {
                console.log(result)
                if (result.code == '1') {
                    // 您申请的金汇资管模拟交易账号：100277299136，密码：123456。
                    // alert(result.msg);
                    var Password = result.data.Password;
                    var UserAccountID = result.data.UserAccountID;
                    window.location.href = './reg.html?UserAccountID=' + UserAccountID + 'Password=' + Password
                    // $(".input-div").css("display", "none");
                    // $(".register-success").css("display", "block");
                } else {
                    alert(result.msg);
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    });

    function validationNow(tel) {
        if (tel !== '') {
            $.ajax({
                type: "post",
                url: "http://" + host + "/app/send/code",
                data: {
                    Mobile: tel,
                    Event: 'reg',
                    Content: Broker
                },
                dataType: "json",
                success: function (data) {
                    console.log(typeof (data.code));
                    if (data.code === 1) {
                        // let second = '已发送';
                        // $('.code').html(second);
                        // $('.code').css('color', '#cccccc')
                        $('.code').html('已发送120');
                        $('.code').css('color', '#fff')
                        $('.code').css('background', '#cccccc')
                        let validationShow = true;
                        let timer = setInterval(() => {
                            if (count > 0 && count <= 120) {
                                count--;
                                console.log(count)
                                $('.code').html('已发送(' + count + ')');
                            } else {
                                clearInterval(timer);
                                validationShow = false;
                                timer = null;
                                count = 120;
                                // second = '获取验证码';
                                $('.code').html('获取验证码');
                                $('.code').css('color', '#fff');
                                $('.code').css('background', '#5775FF');
                                // $('.time').html('');
                                // $('.time').css('color', '#21a9f5')
                            }
                        }, 1000);
                    } else {
                        alert(data.msg);
                    }
                }
            })
        }
    }

    function getType() {
        var content = "";
        $.ajax({
            type: "get",
            url: "http://" + host + "/system/account/type/" + Broker,
            dataType: "json",
            success: function (data) {
                if (data.code == 1) {
                    let typeData = data.data;
                    typeData.map(item => {
                        let str = ""
                        if (item.isShow == 0) {
                            $('.resetLabel').css('display', "none");
                        }
                        let check = item.value ? "checked" : '';
                        content += '<option value=' + item.value + ' id=' + item.key + '>' + item.text + '</option>'
                        // content += '<label class="resetLabel"><input id=' + item.key + ' class="radioStyle" name="type" value="1" type="radio" ' + check + '><span>' + item.text + '</span></label>'
                    })
                    content = '<select>' + content + '</select>'
                    console.log(content)
                    $("#typecontent").html(content)
                }
            }
        })
    }

    getType();
});
