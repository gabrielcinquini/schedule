import { ScheduleType, ServiceSchemaType } from "@/validations/validations";
import { QueryClient } from "@tanstack/react-query";

export function calcularTotal(items?: ScheduleType[] | ServiceSchemaType[]) {
  const totalQuantidades = items?.reduce((total, item) => {
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

export const getInitials = (name?: string | null) => {
  const initials = name && name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');

  return initials;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const revalidateQueryKey = (paths: string[], queryClient: QueryClient) => {
  paths.map((p) => queryClient.invalidateQueries({ queryKey: [p] }))
}