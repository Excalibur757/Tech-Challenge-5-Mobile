import { View, Text } from "react-native";
import Slider from "@react-native-community/slider"; // 👈 Importe correto
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { getSliderRange, getSliderHint } from "../utils/configUtils";
import { SettingsType } from "../constants/defaultSettings";

interface TextConfigProps {
  styles: ReturnType<typeof createConfigStyles>;
  settings: SettingsType;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onLetterSpacingChange: (value: number) => void;
  colors: any;
}

export function TextConfig({
  styles,
  settings,
  onFontSizeChange,
  onLineHeightChange,
  onLetterSpacingChange,
  colors,
}: TextConfigProps) {
  const dynamicStyles = useDynamicStyles();

  const renderSlider = (
    label: string,
    value: number,
    type: "fontSize" | "lineHeight" | "letterSpacing",
    onChange: (value: number) => void
  ) => {
    const range = getSliderRange(type);
    const hint = getSliderHint(type);

    return (
      <View style={styles.controlGroup}>
        <View style={styles.controlHeader}>
          <Text style={[styles.controlLabel, dynamicStyles.label]}>{label}</Text>
          <Text style={[styles.controlValue, dynamicStyles.value]}>
            {type === "lineHeight" ? value.toFixed(1) : `${value}px`}
          </Text>
        </View>
        <Slider
          minimumValue={range.min}
          maximumValue={range.max}
          step={range.step}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          style={styles.slider}
        />
        <View style={styles.rangeLabels}>
          <Text style={[styles.rangeLabel, dynamicStyles.hint]}>
            {type === "fontSize" && "Menor"}
            {type === "lineHeight" && "Compacto"}
            {type === "letterSpacing" && "Junto"}
          </Text>
          <Text style={[styles.rangeLabel, dynamicStyles.hint]}>
            {type === "fontSize" && "Maior"}
            {type === "lineHeight" && "Espaçado"}
            {type === "letterSpacing" && "Separado"}
          </Text>
        </View>
        <Text style={[styles.controlHint, dynamicStyles.hint]}>{hint}</Text>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>📝 Personalizar Texto</Text>
      
      {renderSlider("Tamanho da Fonte", settings.fontSize, "fontSize", onFontSizeChange)}
      {renderSlider("Espaçamento entre Linhas", settings.lineHeight, "lineHeight", onLineHeightChange)}
      {renderSlider("Espaçamento entre Letras", settings.letterSpacing, "letterSpacing", onLetterSpacingChange)}
    </View>
  );
}