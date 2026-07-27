import { Alert } from "react-native";

export function shouldConfirm(extraConfirmation: boolean): boolean {
  return extraConfirmation === true;
}

export function confirmAction(
  extraConfirmation: boolean,
  title: string,
  message: string,
  onConfirm: () => void,
  destructive: boolean = false
): void {
  if (!shouldConfirm(extraConfirmation)) {
    onConfirm();
    return;
  }

  Alert.alert(
    title,
    message,
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Confirmar", 
        style: destructive ? "destructive" : "default",
        onPress: onConfirm
      }
    ]
  );
}