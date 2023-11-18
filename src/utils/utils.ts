import { ScheduleType, ServiceSchemaType } from "@/validations/validations";

export function calcularTotal(items: ScheduleType[] | ServiceSchemaType[]) {
  const totalQuantidades = items.reduce((total, item) => {
    const quantidade = parseFloat(item.value.toString());

    if (!isNaN(quantidade)) {
      return total + quantidade;
    }

    return total;
  }, 0);

  return totalQuantidades
}

export function formatUsername(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = currentValue.replace(/[\W_]+/g, "").toLocaleLowerCase();
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}

export function formatName(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = currentValue.replace(/[\W_]|[\d]+/g, "").toLocaleLowerCase();
  const formattedValue = newVal.charAt(0).toUpperCase() + newVal.slice(1);
  event.target.value = formattedValue;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}

export function formatValue(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value.replace(/[^\d]/g, '');
  const currentPos = event.target.selectionStart || 0;

  const formattedVal = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL'
  }).format(parseInt(currentValue) / 100);

  event.target.value = formattedVal;

  // Define a nova posição do cursor após a formatação
  const newPos = currentPos + formattedVal.length - currentValue.length;
  event.target.setSelectionRange(newPos, newPos);
}

export function formatCPF(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value.replace(/[^\d]/g, '');
  const currentPos = event.target.selectionStart || 0;

  const formattedCPF = currentValue
    .replace(/^(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?$/, (_, p1, p2, p3, p4) => {
      let result = p1;
      if (p2) result += `.${p2}`;
      if (p3) result += `.${p3}`;
      if (p4) result += `-${p4}`;
      return result;
    });

  event.target.value = formattedCPF;

  // Define a nova posição do cursor após a formatação
  const newPos = currentPos + formattedCPF.length - currentValue.length;
  event.target.setSelectionRange(newPos, newPos);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}