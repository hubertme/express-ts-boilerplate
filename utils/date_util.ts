class DateUtil {
    /**
     *
     * @param date - The date object to be converted into string
     * @param separator
     */
    static dateOnlyToString(date: Date, separator: string = '/'): string {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();

        return mm + separator + dd + separator + yyyy;
    }
}

export default DateUtil;
