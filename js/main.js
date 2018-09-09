$(document).ready(function(){

    // Глобальные переменные
    var bWarned = false;
    var bDelWarned = false;
    var isEditForm = false;
    var ccHeight;
    // var contactsNames = {};
    var contacts = {};

    // Загружаем и рисуем список контактов
    var drawContactList = function(startup=false){
        
        // Рисуем пустые карточки по количеству контактов
        $.ajax({
			type: "GET",
			url: "getContactsCount.php",

			success: function(count){
                console.log(count);

                var contactsNum = count;
                var contactList = $('#contactList');
                var contactСardsNum = contactList.children().length;
                var addCards = contactsNum - contactСardsNum;
                // console.log(addCards+' = '+contactsNum+' - '+contactСardsNum); 
                
                for(i = 0; i < addCards; i++){
                    var contactСard = $('<div class="contact-card"></div>'); // Создаем карточку контакта
                    // contactСard.attr('id', contacts[i].id); // id карточки контакта = id записи в БД
                    var contactData = $('<div class="contact-data"></div>'); 
                    var name = $('<div class="cc-name"></div>'); //.text('XXXXX');
                    var phone = $('<div class="cc-phone cc-data"></div>');
                    var email = $('<div class="cc-email cc-data"></div>');
                    var iEdit = $('<div class="edit-icon"><i class="far fa-edit"></i></div>'); 
                    iEdit.hide();

                    contactData.append(name, phone, email);
                    contactСard.append(contactData, iEdit);
                    contactList.append(contactСard);
                }
                if(addCards < 0)
                    for(i = 0; i > addCards; i--){
                        contactList.children().last().remove();
                    }

                contactList.show();

                // При стартовой загрузке рисуем плейсхолдеры
                if(startup)
                    for(i = 0; i < contactsNum; i++){
                        var contactСard = contactList.children().eq(i);
                        contactСard.find('.cc-name').text('XXXXXXX');
                        contactСard.find('.cc-phone').text('XXXXXXX');
                        contactСard.find('.cc-email').text('XXXXXXX');
                    }

                loadContactList(startup);
            }
        });
    }
    
    // Загружаем сами контакты, заполняем ими карточки
    var loadContactList = function(startup=false){
        $.ajax({
            type: "GET",
            url: "getContacts.php",
            type: "json",

            success: function(data){
                // var contacts_l = jQuery.parseJSON(data);
                contacts = jQuery.parseJSON(data);
                console.log(contacts);

                // for(i = 0; i < contactsNum; i++){
                //     contacts[i].id = contacts_l[i].id;
                //     contacts[i].name = contacts_l[i].name;
                //     contacts[i].phone = contacts_l[i].phone;
                //     contacts[i].email = contacts_l[i].email;
                // }
                var contactList = $('#contactList');
                var contactsNum = 0;
                for(item in contacts) contactsNum++;

                for(i = 0; i < contactsNum; i++){
                    var contactСard = contactList.children().eq(i);
                    contactСard.attr('id', contacts[i].id); // id карточки контакта = id записи в БД
                    contactСard.find('.cc-name').text(contacts[i].name);
                    contactСard.find('.cc-phone').text(contacts[i].phone);
                    contactСard.find('.cc-email').text(contacts[i].email);
                    // contactСard.show();
                    // contactsNames[contacts[i].id] = contacts[i].name;
                }
                
                if(startup)
                    $('#searchContact').focus();
            } 
        });
    }

    // При загрузке страницы:
    drawContactList(true);

    // Редактирование контакта - иконка
    $('#contactList').on('mouseenter', '.contact-card', function(){  
        if(!isEditForm)
            $(this).children('.edit-icon').show();
    });

    $('#contactList').on('mouseleave', '.contact-card', function(){  
        $(this).children('.edit-icon').hide();
    });

    // Разворачиваем форму редактирования контакта (по клику на иконке)
    $('#contactList').on('click', '.edit-icon', function(){
        $('.edit-icon').hide();

        var contactCard = $(this).parent();
        ccHeight = contactCard.height();
        contactCard.addClass("focused-form");
        var contactData = contactCard.children('.contact-data');
        var ccName = contactData.children('.cc-name');
        var ccPhone = contactData.children('.cc-phone');
        var ccEmail = contactData.children('.cc-email');
        var oldName = ccName.text();
        var oldPhone = ccPhone.text();
        var oldEmail = ccEmail.text();
        
        var editForm = $('<form id="editContForm" class="editcont-form" method="post"></form>');
        
        // var $efHeader = $('<p class="form-header">Редактирование контакта</p>');
        var iName = $('<input name="name" class="contform-input" type="text">').val(oldName);
        var iPhone = $('<input name="phone" class="contform-input" type="tel">').val(oldPhone);
        var iEmail = $('<input name="email" class="contform-input email-input" type="email">').val(oldEmail);
        var iEmailPat = $('<p class="email-pat input-pat hide">Пример эл. почты: name@example.org</p>');
        var efWarn = $('<p class="form-warning hide"></p>');
        var btns = $('<div class="form-btns"></div>');
        var btnDelete = $('<button class="deleteBtn" type="button">Удалить контакт</button>');
        var btnSave = $('<button class="saveBtn" type="submit" formnovalidate disabled>Сохранить</button>');
        var btnCancel = $('<button class="cancelBtn" type="button">Отмена</button>');

        contactData.hide(); 

        btns.append(btnDelete, btnSave, btnCancel);
        editForm.append(iName, iPhone, iEmail, iEmailPat, efWarn, btns);

        contactCard.append(editForm);
        editForm.css('width', '100%');
        var newHeight = contactCard.height();
        btns.hide();
        editForm.animate({width: '90%'}, 400);
        contactCard.animate({height: newHeight}, 400, function(){
            btns.show();
            contactCard.removeAttr('style');
        });

        setEditForm(true);
    });

    // Нельзя создавать формы редактирования пока открыта хотя бы одна
    var setEditForm = function(is){
        isEditForm = is;
        $('#addContactBtn').prop("disabled", is);
        if(is) bWarned = bDelWarned = false;
    };

    // Предупреждение об удалении контакта
    var delWarning = function(contactCard, on){
        bDelWarned = on;
        var editForm = contactCard.children('#editContForm');
        showFormWarning(editForm, 'Вы точно хотите удалить это контакт?!', true, on);
        if(on)
            contactCard.find('.deleteBtn').addClass('warning-high');
        else
            contactCard.find('.deleteBtn').removeClass('warning-high');
    };

    // Кнопка "Сохранить" становится доступной, если были изменения в input-ах
    $('#contactList').on('change', 'input', function(){
        var contactCard = $(this).parents('.contact-card');
        contactCard.find('.saveBtn').prop("disabled", false);
        delWarning(contactCard, false); // Предупреждение об удалении контакта тоже сбрасывается
    });

    // Замораживаем форму перед "сворачиванием"
    var editFormFreeze = function (contactCard) {
        var editForm = contactCard.children('#editContForm');
        editForm.find('.deleteBtn').prop("disabled", true);
        editForm.find('.saveBtn').prop("disabled", true);
        editForm.find('.cancelBtn').prop("disabled", true);
        editForm.children('input[name="name"]').prop("disabled", true);
        editForm.children('input[name="phone"]').prop("disabled", true);
        editForm.children('input[name="email"]').prop("disabled", true);
    };

    // Сворачиваем форму редактирования контакта 
    var editModeOff = function(contactCard, update=false, callback){
        var oldHeight = contactCard.height();
        contactCard.animate({height: oldHeight}, 10); //для анимации (доб. аттр. 'style' (height))

        contactCard.removeClass("focused-form");
        var contactData = contactCard.children('.contact-data');
        contactData.show(); // contactCard.children('.cc-name').show(); ...

        if(update){
            var editForm = contactCard.children('#editContForm');
            var name = editForm.children('input[name="name"]').val().trim();
            var phone = editForm.children('input[name="phone"]').val().trim();
            var email = editForm.children('input[name="email"]').val().trim();
            // console.log('update: '+name+' '+phone+' '+email);
            contactData.children('.cc-name').text(name);
            contactData.children('.cc-phone').text(phone);
            contactData.children('.cc-email').text(email);
        }
        
        contactCard.children('#editContForm').remove();
        contactCard.animate({height: ccHeight}, 400, function(){
            contactCard.removeAttr('style');
            setEditForm(false);
            if(typeof callback === 'function'){ 
                callback(); 
            }
        });
    };

    // Редактирование контакта - отмена
    $('#contactList').on('click', '.cancelBtn', function(e){
        e.preventDefault();

        var contactCard = $(this).parents('.contact-card');
        editFormFreeze(contactCard);
        editModeOff(contactCard);
    });

    // Редактирование контакта - удаление
    $('#contactList').on('click', '.deleteBtn', function(e){
        e.preventDefault();

        var contactCard = $(this).parents('.contact-card');

        if(!bDelWarned){
            delWarning(contactCard, true);
            return;
        }

        editFormFreeze(contactCard);

        var id = contactCard.attr('id');
        var sendData = 'id=' + id;
        // console.log('delete sendData: '+sendData);

        $.ajax({
			type: "POST",
			url: "deleteContact.php",
			data: sendData,

			success: function(html){
                // console.log(html);
                editModeOff(contactCard);
                console.log(contacts);
                console.log('delete contacts.id = '+id);
                for(var i in contacts)
                    if(contacts[i].id == id){
                        contacts.splice(i, 1);
                        break;
                }
                console.log(contacts);
                contactCard.slideUp(400, 
                    // ()=>{$('#contactList').children('.contact-card[id=id]').remove()});
                    () => { contactCard.remove(); searchResultDecr() }); 
                    //updateContactList);
			}
        });
    });
    
    // Редактирование контакта - submit
    $('#contactList').on('submit', '#editContForm', function(e){
        e.preventDefault();

        var contactCard = $(this).parent();
        delWarning(contactCard, false); // Предупреждение об удалении контакта сбрасывается
        var sendData = checkEditForm($(this)); 
        // console.log('sendData: '+sendData);
        if(sendData == '')
            return;

        editFormFreeze(contactCard);
        //sendData = 'name=' + name + '&phone=' + phone + '&email=' + email;
        var id = contactCard.attr('id');
        sendData += '&id=' + id;

        // optimistic UI:
        var editForm = $(this);
        for(var i in contacts)
            if( contacts[i].id == id ){
                contacts[i].name = editForm.children('input[name="name"]').val().trim();
                contacts[i].phone = editForm.children('input[name="phone"]').val().trim();
                contacts[i].email = editForm.children('input[name="email"]').val().trim();
                break;
            }
        console.log('edit, contacts update');
        console.log(contacts);

        $.ajax({
			type: "POST",
			url: "editContact.php",
			data: sendData,

			success: function(html){
                // console.log(html);
                editModeOff(contactCard, true, updateContactList);
			}
        });
    });

    // Нажали кнопку "+ контакт" => 
    // выводим форму создания контакта, делаем недоступной кнопку "+ контакт"
    $('#addContactBtn').click(function(){
        //Setup form
        var addContForm = $('#addContForm');
        addContForm.children('.form-warning').addClass("hide");
        addContForm.children('.email-pat').addClass("hide");
        addContForm.children('input[name="name"]').val(''); 
        addContForm.children('input[name="phone"]').val(''); 
        addContForm.children('input[name="email"]').val(''); 
        addContForm.find('.saveBtn').prop('disabled', true);
        
        addContForm.parent().slideDown();
        addContForm.children('input[name="name"]').focus();
        setEditForm(true);
    });

    // Прячем форму создания контакта, делаем доступной кнопку "+ контакт"
    var hideAddContactForm = function(){
        var addContForm = $('#addContForm');
        addContForm.parent().slideUp();
        setEditForm(false);
        $('#searchContact').focus();
    }
    
    // Кнопка "Сохранить" становится доступной, если были изменения в input-ах
    $('#addContForm').on('change', 'input', function(){
        // console.log('addContForm input change');
        $('#addContForm').find('.saveBtn').prop('disabled', false);
    });

    // Нажали кнопку "Отмена" на форме создания контакта
    $('#addContForm').on('click', '.cancelBtn', function(e){
        e.preventDefault();
        
        hideAddContactForm();
    });

    // Нажали кнопку "Сохранить" или Enter на форме создания контакта
    $('#addContForm').on('submit', function(e){
        e.preventDefault(); 

        var sendData = checkEditForm($(this)); //?name=&phone=&email=
        // console.log('sendData: '+sendData);
        if(sendData == '')
            return;

        $.ajax({
			type: "POST",
			url: "addContact.php",
			data: sendData,

			success: function(html){
				// console.log(html);
				drawContactList();
			}
        });

        hideAddContactForm();
    });

    // Изменили поле email
    $('.email-input').on('change', function(){
        bWarned = false;
    });

    // Проверяем данные в форме
    var checkEditForm = function(editForm){ //elem_id
        var sendData = '';
        // var editForm = $('#'+elem_id);
        
        var name = editForm.children('input[name="name"]').val().trim();
        var phone = editForm.children('input[name="phone"]').val().trim();
        var email = editForm.children('input[name="email"]').val().trim();
        name = encodeURIComponent(name);
        phone = encodeURIComponent(phone);
        email = encodeURIComponent(email);
        
        // console.log(name+' '+phone+' '+email+' '+elem_id);
                
        if(name == '' || phone == '' || email == ''){
            showFormWarning(editForm, 'Должны быть заполнены все поля!', true);
            // return sendData;
        }
        else if(сheckFormValidity(editForm))
            sendData = 'name=' + name + '&phone=' + phone + '&email=' + email;

        return sendData;
    }

    // Проверяем валидность формы
    var сheckFormValidity = function(editForm){
        // var editForm = $('#'+elem_id);

        var iEmailValidity = editForm.children('input[name="email"]')[0].checkValidity();
        // console.log('iEmailValidity='+iEmailValidity);
        if(!iEmailValidity && !bWarned)
        {
            editForm.children('.email-pat').removeClass("hide");
            showFormWarning(editForm, "Адрес эл. почты не соответствует шаблону. Всё равно сохранить?");
            bWarned = true;
            
            return false;
        }
        
        return true;
    }

    // Показываем предупреждение о валидности формы
    var showFormWarning = function(editForm, msg, high=false, show=true){
        // var editForm = $('#'+elem_id);
        var formWarning = editForm.children('.form-warning');
        // var warnElem = $('<p class="form-warning"></p>');
        // $('#'+elem_id).children('input[name="email"]').after(warnElem);
        if(show){
            formWarning.text(msg);
            formWarning.removeClass("hide warning-high warning-medium");
            formWarning.addClass(high ? "warning-high" : "warning-medium");
        }
        else 
            formWarning.addClass('hide');
    }    

    // Обновляем список контактов
    var updateContactList = function(){
        
        //searchResultBreak();
        loadContactList();
    }

    // Сбрасываем результаты поиска
    var searchResultBreak = function(){
        $('#searchResultContainer').hide();
        $('#contactList').children('.contact-card').show();
    }

    $('#searchResultBreak').on('click', function(){
        searchResultBreak();
        $('#searchContact').val('');
        $('#searchContact').focus();
    });

    // Поиск контактов
    $('#searchContact').keyup(function(e){
        e.preventDefault();

        searchResultBreak();
        var search = $(this).val().trim();
        if(search == '')
            return;

        var resultIDs = searchInNames(search);
        // console.log('resultIDs = '+resultIDs);
        var resultNum = resultIDs.length;
        var contactList = $('#contactList');
        var contactСardsNum = contactList.children().length;
        // console.log('contactСardsNum = '+contactСardsNum);
    
        for(i = 0; i < contactСardsNum; i++){
            var contactСard = contactList.children().eq(i);
            var cardID = contactСard.attr('id');
            var hide = true;
            for(j=0; j<resultNum; j++)
                if( resultIDs[j] == cardID){
                    hide = false;
                    break;
                }
            if(hide) contactСard.hide();
        }

        $('#searchResultNum').text(resultNum);
        $('#searchResultContainer').show();
    });

    // Формируем массив контактов по запросу
    var searchInNames = function(search){
        var resultIDs = [];
        var search = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        // console.log('search = '+search);
        var regex = new RegExp(search, 'i');
        for(var i in contacts){
            var name = contacts[i].name;
            console.log('name: '+name);
            if(regex.test(name)){
                resultIDs.push(contacts[i].id);
                // console.log(name+' name test ok');
            }
        }

        return resultIDs;
    }

    // Декремент результата поиска (при удалении карточки при активной выдаче)
    var searchResultDecr = function(){
        if( $('#searchResultContainer').css('display') != 'none' ){
            var resultNum = $('#searchResultNum').text();
            $('#searchResultNum').text(--resultNum);
            if( resultNum <= 0 )
                searchResultBreak();
        }
    }
    
});