class Messages {

    getEmailsWithCountMessages(listMessagesJSON) {
        function sortRules(a, b) {
            if (a.email > b.email) return 1;
            if (a.email === b.email) return 0;
            if (a.email < b.email) return -1;
        }

        let sortedList = JSON.parse(this.sortListMessages(listMessagesJSON, sortRules));

        let filteredList = [];

        while(sortedList.length > 0) {
            let emailFilter = sortedList[sortedList.length - 1].email;
            let filteredListOnEmail = sortedList.filter(item => item.email === emailFilter);

            filteredList.push({email: emailFilter, count: filteredListOnEmail.length});

            sortedList.length -= filteredListOnEmail.length;
        }

        return JSON.stringify(filteredList);
    }

    sortListMessages(listMessagesJSON, sortRules) {
        let listMessages = JSON.parse(listMessagesJSON);

        return JSON.stringify(listMessages.sort(sortRules));
    }
}

class Executor {

    messagesArrayJSON;
    objectMessages;


    constructor(objectMessages) {
        this.messagesArrayJSON = localStorage.getItem('messages');
        this.objectMessages = objectMessages;
        this.renderTable();
    }

    sendMessage(email, message) {
        let messagesArray = JSON.parse(this.messagesArrayJSON);
        if(!messagesArray) messagesArray = [];

        messagesArray.push({email, message});
        this.messagesArrayJSON = JSON.stringify(messagesArray);
        localStorage.setItem('messages', this.messagesArrayJSON);
        this.renderTable();
    }

    renderTable() {
        let contentTable = document.getElementById('listMessages');
        let clearTable = document.createElement('tbody');
        clearTable.id = 'listMessages';
        contentTable.replaceWith(clearTable);
        contentTable = document.getElementById('listMessages');

        if(!this.messagesArrayJSON) {
            let tr = document.createElement('tr');
            let tdEmail = document.createElement('td');
            let tdCount = document.createElement('td');

            tdEmail.append('Сообщений нет');
            tdCount.append('');

            tr.append(tdEmail);
            tr.append(tdCount);

            contentTable.append(tr);
            return;
        }

        let listMessages = JSON.parse(this.objectMessages.getEmailsWithCountMessages(this.messagesArrayJSON));

        for(let i = 0; i < listMessages.length; i++) {
            let tr = document.createElement('tr');
            let tdEmail = document.createElement('td');
            let tdCount = document.createElement('td');
            let contentCount;

            if(listMessages[i].count == '1') {
                let messagesArray = JSON.parse(this.messagesArrayJSON);
                let filteredMessages = messagesArray.filter(function (item) {
                    return item.email === listMessages[i].email;
                });
                contentCount = filteredMessages[0].message;
            }
            else {
                let button = document.createElement('button');
                button.append(listMessages[i].count);
                button.setAttribute('onClick', `showMessagesOnEmail('${listMessages[i].email}', 'emailNumber${i}')`);
                contentCount = button;
            }

            tdEmail.append(listMessages[i].email);
            tdCount.append(contentCount);
            tdCount.id = `emailNumber${i}`;

            tr.append(tdEmail);
            tr.append(tdCount);

            contentTable.append(tr);
        }
    }

    showMessagesOnEmail(email, idElement) {
        let messagesArray = JSON.parse(this.messagesArrayJSON);

        let filteredMessages = messagesArray.filter(function(item) {
            return item.email === email;
        });

        let element = document.getElementById(idElement);
        let clearElement = document.createElement('td');
        clearElement.id = idElement;
        element.replaceWith(clearElement);
        element = document.getElementById(idElement);

        for(let i = 0; i < filteredMessages.length; i++) {
            let str = i + 1 + ': ' + filteredMessages[i].message;
            let br = document.createElement('br');
            element.append(str);
            element.append(br);
        }
    }
}

let messages = new Messages();
let executor = new Executor(messages);

function showMessagesOnEmail(email, idElement) {
    executor.showMessagesOnEmail(email, idElement);
}

function send() {
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    executor.sendMessage(email, message);

    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

function clearMessages() {
    localStorage.clear();
    executor.messagesArrayJSON = null;
    executor.renderTable();
}