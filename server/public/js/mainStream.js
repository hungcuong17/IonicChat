const socket = io();

// Lấy đổi tượng stream cho cuộc gọi video
function openStreamCallVideo() {
    const config = {audio: true, video: true};
    return navigator.mediaDevices.getUserMedia(config);
}
// Lấy đổi tượng stream cho cuộc gọi thường
function openStreamCall() {
    const config = {audio: true, video: false};
    return navigator.mediaDevices.getUserMedia(config);
}

// Function play cuộc thoại ()
function playstream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// Lấy đối tượng peer từ server peer tự tạo
const peer = new Peer({host: 'localhost',port: 9000,path: '/ionicChat'});


// function gọi video
$("#callVideo").click(() => {
    let data = {
        receiverId: '5ece9b3ac79668226c3dd2b9',
        peerID: peer.id
    }
    socket.emit('caller', data);
})

// function lấy idPeer gửi co người nhận cuộc gọi
socket.on('get_peerId', peerID => {
    $("#peerID").append(peerID);
    peerID !== "" ? $('#notication').show() : null;
});

// function chấp nhân trả lời cuộc gọi video
$("#replyCallVideo").click(() => {
    let peerID = $("#peerID").text();
    let data = {
        receiverId: "5ece9b6a1560e01ae49281b7",
        status: true
    }
    console.log(peerID);
    openStreamCallVideo().then(stream => {
        playstream('localStream', stream);
        const call = peer.call(peerID, stream);
        call.on('stream', remoteStream => playstream('remoteStream', remoteStream))
    })
    socket.emit('status_call', data);
})

// Lấy trạng thái cuộc gọi
socket.on('get_status_call', status => {
    $('#statusCall').append(status);
    status===false ? $('#notication1').show() : null;
})

// hiện thị cuộc chat video cho người gọi
peer.on('call', call => {
    console.log()
    if($('#statusCall').text()==='true'){
        openStreamCallVideo().then(stream => {
            call.answer(stream);
            playstream('localStream', stream);
            call.on('stream', remoteStream => playstream('remoteStream', remoteStream))
        })
    } else{
        $('#notication1').show();
    }
})

// function ko chấp nhận cuộc thoại
$('#noReply').click(()=>{
    let data = {
        receiverId: "5ece9b6a1560e01ae49281b7",
        status: false
    }
    $('#notication').hide();
    socket.emit('status_call', data);
})














$('#notication').hide();
$('#notication1').hide();

function myFunctionJoinChat() {
    socket.emit('online', '5ece9b6a1560e01ae49281b7');

}

function myFunctionJoinChat2() {
    socket.emit('online', '5ece9b3ac79668226c3dd2b9');
}