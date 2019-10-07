class Messages {

    messagesJSON;

    constructor() {
        this.messagesJSON = localStorage.getItem('messages');
    }

    getListMessages() {
        return this.messagesJSON;
    }

    addMessage(message, id = false) {
        let messages = JSON.parse(this.messagesJSON);
        if(id) {
            messages.find((item, index) => {
                if(index === 0) return;
                if(item.id == id) {
                    messages[index].messages.push(JSON.parse(message));
                    messages[index].messages[0]++;
                    return true;
                }
            });
        }
        else {
            messages.push(JSON.parse(message));
            messages[0]++;
        }

        this.messagesJSON = JSON.stringify(messages);
        this.reloadLocaleStorage();
    }

    deleteMessage(id_message, id_email) {
        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            let index_email = index;
            if(item.id == id_email) {
                item.messages.find((item, index) => {
                    if(index === 0) return;
                    if(item.id == id_message) {
                        messages[index_email].messages.splice(index, 1);

                        this.messagesJSON = JSON.stringify(messages);
                        return true;
                    }
                });
                return true;
            }
        });

        this.reloadLocaleStorage();
    }

    deleteMessages(id_email) {
        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            if(item.id == id_email) {
                messages.splice(index, 1);

                this.messagesJSON = JSON.stringify(messages);
                return true;
            }
        });

        this.reloadLocaleStorage();
    }

    swapMessages(idEmail, idMessageFrom, idMessageTo) {
        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            if(item.id == idEmail) {
                let indexMessagesFrom = null;
                let indexMessagesTo = null;
                let Email = messages[index].messages;
                item.messages.find((item, index) => {
                    if(index === 0) return;
                    if(item.id == idMessageFrom) {
                        indexMessagesFrom = index;
                    }
                    if(item.id == idMessageTo) {
                        indexMessagesTo = index;
                    }
                    if(indexMessagesFrom && indexMessagesTo) {
                        [Email[indexMessagesTo], Email[indexMessagesFrom]] = [Email[indexMessagesFrom], Email[indexMessagesTo]];
                        return true;
                    }
                });
                return true;
            }
        });

        this.messagesJSON = JSON.stringify(messages);
        this.reloadLocaleStorage();
    }

    clearMessages() {
        this.messagesJSON = JSON.stringify([1]);
        this.reloadLocaleStorage();
    }

    reloadLocaleStorage() {
        localStorage.setItem("messages", this.messagesJSON);
    }
}

class Executor {

    messagesJSON;
    objectMessages;
    replaceFrom;
    replaceTo;

    constructor(objectMessages) {
        this.objectMessages = objectMessages;
        this.messagesJSON = this.objectMessages.getListMessages();
        this.setState();
    }

    setState(id = false) {
        let messages = JSON.parse(this.messagesJSON);
        let result;

        if(messages.length < 2) return this.renderTable();

        if(id) {
              messages.find(function(item, index){
                  if(item.id == id) {
                      messages[index].opened = !messages[index].opened;
                      return true;
                  }
              });
              result = messages;
        }
        else {
            result = messages.map(function(item, index){
                if(index === 0) return item;
                item.opened = false;
                return item;
            });
        }
        this.messagesJSON = JSON.stringify(result);
        this.renderTable();
    }

    sendMessage(email, text) {
        let messages = JSON.parse(this.messagesJSON);

        let result = messages.find((item, index) => {
            if(index === 0) return;

            if(item.email === email) {
                let message = {
                    id: item.messages[0],
                    text,
                };

                item.messages[0]++;
                messages[index].messages.push(message);

                this.objectMessages.addMessage(JSON.stringify(message), messages[index].id);

                return true;
            }
        });

        if(!result) {
            let message = {
                id: messages[0],
                email: email,
                messages: [
                    2,
                    {id: 1, text},
                ],
            };

            this.objectMessages.addMessage(JSON.stringify(message));
            message.opened = false;
            messages.push(message);
            messages[0]++;
        }

        this.messagesJSON = JSON.stringify(messages);
        this.renderTable();
    }

    deleteMessage(id_message, id_email) {
        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            let index_email = index;
            if(item.id == id_email) {
                item.messages.find((item, index) => {
                    if(index === 0) return;
                    if(item.id == id_message) {
                        this.objectMessages.deleteMessage(id_message, id_email);
                        messages[index_email].messages.splice(index, 1);

                        this.messagesJSON = JSON.stringify(messages);
                        return true;
                    }
                });
                return true;
            }
        });

        this.renderTable();
    }

    deleteMessages(id_email) {
        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            if(item.id == id_email) {
                this.objectMessages.deleteMessages(id_email);
                messages.splice(index, 1);

                this.messagesJSON = JSON.stringify(messages);
                return true;
            }
        });

        this.renderTable();
    }

    clearMessages() {
        this.objectMessages.clearMessages();
        this.messagesJSON = JSON.stringify([1]);
        this.renderTable();
    }

    swap() {
        let idEmailFrom = this.replaceFrom.split('-')[0];
        let idEmailTo = this.replaceTo.split('-')[0];

        if(idEmailFrom !== idEmailTo) return;

        let idMessageFrom = this.replaceFrom.split('-')[1];
        let idMessageTo = this.replaceTo.split('-')[1];

        let messages = JSON.parse(this.messagesJSON);

        messages.find((item, index) => {
            if(index === 0) return;
            if(item.id == idEmailFrom) {
                let Email = messages[index].messages;
                let indexMessagesFrom = null;
                let indexMessagesTo = null;
                item.messages.find((item, index) => {
                    if(index === 0) return;
                    if(item.id == idMessageFrom) {
                        indexMessagesFrom = index;
                    }
                    if(item.id == idMessageTo) {
                        indexMessagesTo = index;
                    }
                    if(indexMessagesFrom && indexMessagesTo) {
                        [Email[indexMessagesTo], Email[indexMessagesFrom]] = [Email[indexMessagesFrom], Email[indexMessagesTo]];
                        return true;
                    }
                });
                return true;
            }
        });

        this.objectMessages.swapMessages(idEmailFrom, idMessageFrom, idMessageTo);
        this.messagesJSON = JSON.stringify(messages);
        this.renderTable();
    }

    renderTable() {
        let contentTable = document.getElementById('listMessages');
        let clearTable = document.createElement('div');
        let messages = JSON.parse(this.messagesJSON);

        clearTable.id = 'listMessages';
        clearTable.className = 'table__body';
        contentTable.replaceWith(clearTable);
        contentTable = document.getElementById('listMessages');

        if(messages.length < 2) {
            let element = document.createElement('div');
            let row = document.createElement('div');
            let col = document.createElement('div');

            element.className = 'element';
            row.className = 'row';
            col.className = 'col';

            col.append('Сообщений нет');
            row.append(col);
            element.append(row);
            contentTable.append(element);
            return;
        }

        for(let i = 1; i < messages.length; i++) {
            let element = document.createElement('div');
            let row = document.createElement('div');
            let emailCol = document.createElement('div');
            let messagesCol = document.createElement('div');
            let buttonCol = document.createElement('div');
            let buttonDel = document.createElement('button');
            let contentCount;

            element.className = 'element';
            row.className = 'row';
            emailCol.className = 'col';
            messagesCol.className = 'col';
            buttonCol.classNmae = 'col del';

            buttonDel.append('×');
            buttonDel.setAttribute('onclick', `deleteMessagesByEmail('${messages[i].id}')`);
            buttonCol.append(buttonDel);
            emailCol.append(messages[i].email);
            row.append(emailCol);

            if(messages[i].messages.length < 3) {
                contentCount = messages[i].messages[1].text;
            }
            else {
                let button = document.createElement('button');
                if(messages[i].opened) {
                    button.append(messages[i].messages.length - 1 + ' ▼');
                }
                else {
                    button.append(messages[i].messages.length - 1 + ' ►');
                }
                button.setAttribute('onClick', `uncoverOnEmailId('${messages[i].id}')`);
                contentCount = button;
            }

            messagesCol.append(contentCount);
            element.id = `emailId${messages[i].id}`;

            row.append(messagesCol);
            row.append(buttonCol);
            element.append(row);

            if(messages[i].opened && messages[i].messages.length > 2) {
                let showedMessages = document.createElement("div");
                let messagesArray = messages[i].messages;

                showedMessages.className = 'showedMessages';

                for(let j = 1; j < messagesArray.length; j++) {
                    let rowMessage = document.createElement("div");
                    let colNumber = document.createElement("div");
                    let colText = document.createElement("div");
                    let colDel = document.createElement("div");
                    let button = document.createElement("button");

                    rowMessage.className = "rowMessage";
                    rowMessage.setAttribute('draggable', 'true');
                    rowMessage.addEventListener('dragstart', setReplaceFrom, false);
                    rowMessage.addEventListener('dragleave', setReplaceTo, false);
                    rowMessage.addEventListener('dragend', swap, false);
                    rowMessage.id = messages[i].id + '-' + messagesArray[j].id;
                    colNumber.className = "col";
                    colText.className = "col";
                    colDel.className = "col del";

                    button.append("×");
                    button.setAttribute('onclick', `deleteMessageById('${messagesArray[j].id}', '${messages[i].id}')`);
                    colDel.append(button);
                    colText.append(messagesArray[j].text);
                    colNumber.append(j);

                    rowMessage.append(colNumber);
                    rowMessage.append(colText);
                    rowMessage.append(colDel);

                    showedMessages.append(rowMessage);
                }

                element.append(showedMessages);
            }

            contentTable.append(element);
        }
    }
}

let executor = new Executor(new Messages());

function uncoverOnEmailId(id) {
    executor.setState(id);
}

function send() {
    let email = document.getElementById('email').value;
    let text = document.getElementById('text').value;

    let reg = /.+@.+\..+/i;
    if(!reg.test(String(email).toLowerCase())) {
        alert('Не верный E-mail');
        return;
    }
    if(text == '') {
        alert('Введите текст сообщения!');
        return;
    }

    executor.sendMessage(email, text);

    document.getElementById('email').value = '';
    document.getElementById('text').value = '';
}

function deleteMessageById(id_message, id_email) {
    executor.deleteMessage(id_message, id_email);
}

function deleteMessagesByEmail(id_email) {
    executor.deleteMessages(id_email);
}

function clearMessages() {
    if(confirm('Удалить все сообщения?')) {
        executor.clearMessages();
    }
}

function setReplaceFrom() {
    executor.replaceFrom = this.id;
}

function setReplaceTo() {
    executor.replaceTo = this.id;
}

function swap() {
    executor.swap();
}