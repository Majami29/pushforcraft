
// PUSH Уведомления - WDC
// -------------------------------------------------------------------------------

// УДАЛЕНИЕ БАННЕРА ЕСЛИ УЖЕ РАЗРЕШИЛИ УВЕДОМЛЕНИЯ
// ПРОВЕРКА НЕПРОЧИТАННЫХ СООБЩЕНИЙ И ОТПРАВКА ЕСЛИ РАЗРЕШЕНЫ УВЕДОМЛЕНИЯ


const pushgranted = localStorage.getItem("accesspush");
function pushsavelocal(){
  localStorage.setItem("accesspush", true);
}

document.addEventListener('DOMContentLoaded', (event) =>{ 
  if(pushgranted){ 
    setInterval(function()  { 
        sendnewmsgspsh(); 
      }, 1500);
  } else  {
    if(window.matchMedia('(display-mode: standalone)').matches){
      setTimeout(function()  {
           document.body.addEventListener('click', requestNotificationPermission);
        }, 2000);
      }
    }
})



// -------------------------------------------------------------------------------
// Функции отправки и прочего



// Запрос разрешения на отправку уведомлений
function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(function(permission) {
          if (permission === 'granted') {
           pushsavelocal();   sendpush();   

            setTimeout(() => {
              location.reload();
            }, 300);           

          } else {
            console.log('Notification permission denied.');
          }
        })
        .catch(function(error) {
          console.log('Error occurred while requesting notification permission: ', error);
        });
    }
    }
    

    
    //---------------------------------
   
    
    function sendpush() {
    if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
           setTimeout(() => {
        console.log("not");
      }, 250);
     return;
    }
    
    try {
    setTimeout(() => {
      
     navigator.serviceWorker.getRegistration()
       .then((reg) => reg.showNotification("Вы будете получать уведомления об актульных новостях и непрочитанных сообщениях!"))
       .catch((err) => console.log('Service Worker registration error: ' + err));
      }, 5000);
    } catch (err) {
           setTimeout(() => {
        console.log("not");
      }, 250);
    }
    }



        // -------------------------------------------------------------------------------
        // декодер + передача непрочитанных + подгрузка и формировка для отправки новых сообщений



function sendnewmsgspsh() {
  var inputValue = document.getElementById('messageData').value;
  var decodedValues = JSON.parse(inputValue);

  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    console.log("Браузер не поддерживает уведомления или сервис-воркеры.");
    return;
  }

  try {
    navigator.serviceWorker.getRegistration()
      .then((reg) => {
        for (var key in decodedValues) {
          if (decodedValues.hasOwnProperty(key)) {
            var loginValue = decodedValues[key]["login"];
            var messageValue = decodedValues[key]["message"];
            var pushNotification = loginValue + ": " + messageValue;
            clearMsgSentKeysFromLocalStorage();
            
            // Проверяем, было ли сообщение уже отправлено
            if (!localStorage.getItem('msgSent_' + key)) {
              reg.showNotification(pushNotification);
              // Помечаем сообщение как отправленное в localStorage
              localStorage.setItem('msgSent_' + key, true);
            }
          }
        }
      })
      .catch((err) => console.error('Ошибка при получении регистрации сервис-воркера: ' + err));
  } catch (err) {
    console.error('Произошла ошибка: ' + err);
  }
}





      
       // -------------------------------------------------------------------------------
        // Сохранение и удаление id сообщения в localstorage для предотвращения повторной отправки
        // ПОКА НЕ ДОРАБОТАНО 
        // 25 01 2024 - проверка встроена по ключу в отправку


/*
        function savemsgid(){
          var msgId = 1;
          while (localStorage.getItem('msgnum' + msgId)) {
            msgId++;
          }
          var msgIdKey = 'msgnum' + msgId;
          localStorage.setItem(msgIdKey, "true");
        }

        function clearMagidFromLocalStorage() {
          var keysToDelete = [];
          for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf('msgnum') === 0) {
              keysToDelete.push(key);
            }
          }
          keysToDelete.forEach(function(key) {
            localStorage.removeItem(key);
          });
        }
*/

       // -------------------------------------------------------------------------------
        // очистка id сообщений из памяти
        // ПОКА НЕ ДОРАБОТАНО 

function clearMsgSentKeysFromLocalStorage() {
var inputVal = document.getElementById('messageData').value;
if (inputVal == '' || inputVal ==' ' || inputVal == 'null' || inputVal == 'false'){
  for (var key in localStorage) {
    if (key.startsWith('msgSent_')) {
      localStorage.removeItem(key);
    }
  }
 }
}