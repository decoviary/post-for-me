export function Component() {
  return (
    <form
      method="post"
      id="logout-form"
      ref={(form) => {
        if (form) {
          form.submit();
        }
      }}
    >
      <input type="hidden" name="logout" value="true" />
    </form>
  );
}
