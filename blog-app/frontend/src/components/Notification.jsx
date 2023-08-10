export default function Notification({ notification }) {
  if (!notification) return null;

  let colorMsg = "green";
  let borderMsg = "2px solid green";

  if (notification.type === "error") {
    colorMsg = "red";
    borderMsg = "2px solid red";
  }

  const notificationStyles = {
    backgroundColor: "lightgray",
    fontSize: 25,
    color: colorMsg,
    border: borderMsg,
    padding: 5,
    marginBottom: 25,
  };

  return (
    <div style={notificationStyles} id="notification">
      {notification.message}
    </div>
  );
}
