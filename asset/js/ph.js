function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("telegram");
if (id == undefined) {
    id = '-1001242504941';
}

var data = {
    suhu: 0,
    gas: 0,
    ph: 0,
    date: new Date(),
    date_str: new Date().toString(),
    nama: "Nama Anda",
    relay_name: ["Relay 1", "Relay 2", "Relay 3"],
    relay1: false,
    relay2: false,
    relay3: false,
    interval_name: "1 Jam"
};

var datenow = new Date();
var datalast = new Date();

var time_kolam = 100;
var time_ph = 100;
var time_suhu = 100;
var time_gas = 100;

var selectInputKolam = document.getElementById("time-kolam");
var selectInputPh = document.getElementById("time-ph");
var selectInputSuhu = document.getElementById("time-suhu");
var selectInputGas = document.getElementById("time-gas");

time_kolam = selectInputKolam.options[selectInputKolam.selectedIndex].value;
time_ph = selectInputPh.options[selectInputPh.selectedIndex].value;
time_suhu = selectInputSuhu.options[selectInputSuhu.selectedIndex].value;
time_gas = selectInputGas.options[selectInputGas.selectedIndex].value;

if (navigator.userAgent.match(/iPhone/i)) {
    document.getElementById('smartphone').innerHTML = ` 
    <div>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Hai!</strong> Anda Menggunakan IPhone Sebaiknya Mengunakan Mode Landscape / Miring 
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>`;
}


if (navigator.userAgent.match(/Android/i)) {
    document.getElementById('smartphone').innerHTML = `
    <div>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Hai!</strong> Anda Menggunakan Android Sebaiknya mengunakan Mode Landscape / Miring
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>`;
}

function hideDisplay() {
    document.getElementById("app").style.display = "none";
    document.getElementById("error").style.display = "block";
}

function showDisplay() {
    document.getElementById("app").style.display = "block";
    document.getElementById("error").style.display = "none";
}


axios.get('https://gradien.co:7777/api/telegram/' + id + "")
    .then((response) => {
        showDisplay();
        if (response.data.data.gas == false) {
            temp_gas = 0;
        } else {
            temp_gas = 1;
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'long' };
        const options2 = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        data.suhu = response.data.data.suhu;
        data.gas = temp_gas;
        data.ph = response.data.data.ph;
        data.date = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options2);
        data.date_str = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options);
        data.nama = response.data.data.nama;
        data.relay_name = response.data.data.relay_name;
        data.relay1 = response.data.data.relay1;
        data.relay2 = response.data.data.relay2;
        data.relay3 = response.data.data.relay3;
        data.interval_name = response.data.data.interval_name;
        if (response.data.data.msg != null) {
            clearInterval(interval);
            document.getElementById('app').innerHTML = ' <div class="pt-4 pl-2 pr-2 pb-4"></div><div class="col-12"><div class="pt-4 text-center"><div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Gagal Menyambung Ke Server </strong></div></div></div>';
        }
    })
    .catch((error) => {
        hideDisplay();
        document.getElementById('error').innerHTML = ' <div class="pt-4 pl-2 pr-2 pb-4"></div><div class="col-12"><div class="pt-4 text-center"><div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Gagal Menyambung Ke Internet</strong></div></div></div>';
    });

function getData() {
    axios.get('https://gradien.co:7777/api/telegram/' + id + "")
        .then((response) => {
            showDisplay();
            if (response.data.data.gas == false) {
                temp_gas = 0;
            } else {
                temp_gas = 1;
            }
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'long' };
            const options2 = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            data.suhu = response.data.data.suhu;
            data.gas = temp_gas;
            data.ph = response.data.data.ph;
            data.date = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options2);
            data.date_str = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options);
            data.nama = response.data.data.nama;
            data.relay_name = response.data.data.relay_name;
            data.relay1 = response.data.data.relay1;
            data.relay2 = response.data.data.relay2;
            data.relay3 = response.data.data.relay3;
            data.interval_name = response.data.data.interval_name;
        })
        .catch((error) => {
            hideDisplay();
            document.getElementById('error').innerHTML = ' <div class="pt-4 pl-2 pr-2 pb-4"></div><div class="col-12"><div class="pt-4 text-center"><div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Gagal Menyambung Ke Internet</strong></div></div></div>';
        });
    return data;
}

Plotly.plot('ph', [{
    y: [data.ph],
    mode: 'lines+markers',
    marker: { color: 'green', size: 4 },
    line: { width: 2 },
    name: 'PH'
}]);

Plotly.plot('suhu', [{
    y: [data.suhu],
    mode: 'bar',
    marker: { color: 'blue', size: 4 },
    line: { width: 2 },
    name: 'Suhu'
}]);

Plotly.plot('gas', [{
    y: [data.gas],
    mode: 'lines+markers',
    marker: { color: 'red', size: 4 },
    line: { width: 2 },
    name: 'Gas'
        //,x: [data.date]
}]);

Plotly.plot('custome', [{
    y: [data.ph],
    mode: 'lines+markers',
    marker: { color: 'green', size: 4 },
    line: { width: 2 },
    name: 'PH'
        //,x: [data.date]
}, {
    y: [data.suhu],
    mode: 'lines+markers',
    marker: { color: 'blue', size: 4 },
    line: { width: 2 },
    name: 'Suhu'
        //,x: [data.date]
}, {
    y: [data.gas],
    mode: 'lines+markers',
    marker: { color: 'red', size: 4 },
    line: { width: 2 },
    name: 'Gas Belerang'
        //,x: [data.date]
}], { title: "Grafik Gabungan" });

var cnt_kolam = 0;
var cnt_suhu = 0;
var cnt_ph = 0;
var cnt_gas = 0;

var relay_1 = './asset/img/off.jpg';
var relay_2 = './asset/img/off.jpg';
var relay_3 = './asset/img/off.jpg';

var interval = setInterval(function() {
    time_kolam = selectInputKolam.options[selectInputKolam.selectedIndex].value;
    time_ph = selectInputPh.options[selectInputPh.selectedIndex].value;
    time_suhu = selectInputSuhu.options[selectInputSuhu.selectedIndex].value;
    time_gas = selectInputGas.options[selectInputGas.selectedIndex].value;
    data = getData();
    document.getElementById("date-custome1").innerHTML = data.date_str;
    document.getElementById("date-custome2").innerHTML = data.date_str;
    document.getElementById("date-custome3").innerHTML = data.date_str;
    document.getElementById("date-custome4").innerHTML = data.date_str;
    document.getElementById("relay1").innerHTML = data.relay_name[0];
    document.getElementById("relay2").innerHTML = data.relay_name[1];
    document.getElementById("relay3").innerHTML = data.relay_name[2];
    if (data.relay1 == true) {
        relay_1 = './asset/img/on.jpg';
    } else {
        relay_1 = './asset/img/off.jpg';
    }
    if (data.relay2 == true) {
        relay_2 = './asset/img/on.jpg';
    } else {
        relay_2 = './asset/img/off.jpg';
    }
    if (data.relay3 == true) {
        relay_3 = './asset/img/on.jpg';
    } else {
        relay_3 = './asset/img/off.jpg';
    }

    document.getElementById("relay1status").src = relay_1;
    document.getElementById("relay2status").src = relay_2;
    document.getElementById("relay3status").src = relay_3;

    document.getElementById("intervalstatus").innerHTML = data.interval_name;
    document.getElementById("nama").innerHTML = '<button class="btn btn-outline-success my-2 my-sm-0" type="submit" disabled>' + data.nama + '</button>';
    datanow = data.date;
    if (datanow == datalast) {
        document.getElementById('notif').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Data Sensor Berhenti</strong> pada ' + data.date_str + '</div>';
    } else {
        document.getElementById('notif').innerHTML = '';
    }
    datalast = datanow;
    Plotly.extendTraces('custome', {
        y: [
            [data.ph],
            [data.suhu],
            [data.gas]
        ]
    }, [0, 1, 2]);

    Plotly.extendTraces('ph', {
        y: [
            [data.ph]
        ]
    }, [0]);

    Plotly.extendTraces('suhu', {
        y: [
            [data.suhu]
        ]
    }, [0]);

    Plotly.extendTraces('gas', {
        y: [
            [data.gas]
        ]
    }, [0]);
    cnt_gas++;
    cnt_kolam++;
    cnt_ph++;
    cnt_suhu++;
    if (cnt_suhu > time_suhu) {
        Plotly.relayout('suhu', {
            xaxis: {
                range: [cnt_suhu - time_suhu, cnt_suhu]
            }
        });
    } else {
        Plotly.relayout('suhu', {
            xaxis: {
                range: [0, cnt_suhu]
            }
        });
    }
    if (cnt_ph > time_ph) {
        Plotly.relayout('ph', {
            xaxis: {
                range: [cnt_ph - time_ph, cnt_ph]
            }
        });
    } else {
        Plotly.relayout('ph', {
            xaxis: {
                range: [0, cnt_ph]
            }
        });
    }
    if (cnt_gas > time_gas) {
        Plotly.relayout('gas', {
            xaxis: {
                range: [cnt_gas - time_gas, cnt_gas]
            }
        });
    } else {
        Plotly.relayout('custome', {
            xaxis: {
                range: [0, cnt_gas]
            }
        });
    }
    if (cnt_kolam > time_kolam) {

        Plotly.relayout('custome', {
            xaxis: {
                range: [cnt_kolam - time_kolam, cnt_kolam]
            }
        });
    } else {
        Plotly.relayout('custome', {
            xaxis: {
                range: [0, cnt_kolam]
            }
        });
    }
}, 1000);