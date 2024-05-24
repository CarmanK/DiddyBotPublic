const fs = require('fs');

/**
 * Add commas to every third digit in a given number
 * @param {Number} number The number to add commas to
 * @returns {String} The formatted number as a string
 */
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Write the reminders list to a file
 */
function writeRemindersToFile() {
    const jsonString = JSON.stringify(global.reminders_list);
    fs.writeFile('./reminder_list_file.json', jsonString, error => {
        if (error) {
            console.error('Error writing the reminder file.\n', error);
        }
    });
}

module.exports = {
    addCommas,
    writeRemindersToFile
};
