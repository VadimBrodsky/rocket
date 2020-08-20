export default function formData(data: { [key: string]: string }) {
  const form = new FormData();
  Object.entries(data).forEach(([key, val]) => form.append(key, val));
  return form;
}
