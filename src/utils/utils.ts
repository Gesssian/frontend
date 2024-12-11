export const formatDate = (value:string, format={
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
}) => {
    if (value) {
        return new Intl.DateTimeFormat("ru", format).format(Date.parse(value)).replace("в ", "");
    }
}