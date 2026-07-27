import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ScrollView,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";

const TUTORIAL_KEY = "@tutorial_completed";
const { width, height } = Dimensions.get("window");

interface TutorialProps {
  onComplete?: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

const steps: TutorialStep[] = [
  {
    id: 1,
    title: "Bem-vindo! 👋",
    description: "Este é o SeniorEase, seu assistente de tarefas diárias. Vamos te guiar pelos principais recursos!",
    emoji: "🎉"
  },
  {
    id: 2,
    title: "📝 Adicionar Tarefas",
    description: "Digite sua tarefa no campo abaixo e selecione a prioridade (Baixa, Média ou Alta). Toque no botão + para adicionar.",
    emoji: "✏️"
  },
  {
    id: 3,
    title: "✅ Concluir Tarefas",
    description: "Toque no checkbox ao lado da tarefa para marcá-la como concluída. Ela irá para o histórico automaticamente!",
    emoji: "✅"
  },
  {
    id: 4,
    title: "🔔 Lembretes e Notificações",
    description: "O app te avisa sobre tarefas urgentes (🔴) e atrasadas (⚠️). Configure no menu de configurações.",
    emoji: "🔔"
  },
  {
    id: 5,
    title: "⚙️ Modo Completo",
    description: "Ative o modo completo para ter acesso a filtros, ordenação, subtarefas, notas e estatísticas detalhadas!",
    emoji: "🚀"
  },
  {
    id: 6,
    title: "Pronto para começar! 🎯",
    description: "Agora você conhece todos os recursos. Vamos começar a organizar suas tarefas!",
    emoji: "💪"
  }
];

export function Tutorial({ onComplete }: TutorialProps) {
  const { colors } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o tutorial já foi visto
  useEffect(() => {
    const checkTutorial = async () => {
      try {
        const completed = await AsyncStorage.getItem(TUTORIAL_KEY);
        if (completed !== "true") {
          setVisible(true);
        }
      } catch (error) {
        console.error("Erro ao verificar tutorial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTutorial();
  }, []);

  // Função para avançar passo
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  // Função para voltar passo
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Função para pular tutorial
  const skipTutorial = async () => {
    await completeTutorial();
  };

  // Função para completar tutorial
  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_KEY, "true");
      setVisible(false);
      onComplete?.();
    } catch (error) {
      console.error("Erro ao salvar tutorial:", error);
    }
  };

  // Calcular progresso
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isLoading || !visible) {
    return null;
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Estilos locais baseados nas cores
  const styles = StyleSheet.create({
    tutorialOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    tutorialModal: {
      width: Math.min(width - 40, 400),
      maxHeight: height * 0.85,
      borderRadius: 24,
      padding: 24,
      backgroundColor: colors.background || "#FFFFFF",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    tutorialProgressBar: {
      height: 4,
      backgroundColor: colors.border || "#E0E0E0",
      borderRadius: 2,
      marginBottom: 20,
      overflow: "hidden",
    },
    tutorialProgressFill: {
      height: "100%",
      backgroundColor: colors.primary || "#2F80ED",
      borderRadius: 2,
    },
    tutorialScrollContent: {
      flexGrow: 1,
    },
    tutorialContent: {
      alignItems: "center",
      paddingVertical: 10,
      minHeight: height * 0.35,
    },
    tutorialEmoji: {
      fontSize: 72,
      marginBottom: 16,
      textAlign: "center",
    },
    tutorialTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
      color: colors.text || "#333333",
    },
    tutorialDescription: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      color: colors.text || "#555555",
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    tutorialDots: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
      marginBottom: 4,
    },
    tutorialDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border || "#D0D0D0",
    },
    tutorialDotActive: {
      width: 24,
      backgroundColor: colors.primary || "#2F80ED",
    },
    tutorialButtons: {
      flexDirection: "column",
      gap: 12,
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border || "#E0E0E0",
      paddingTop: 16,
    },
    tutorialSkipButton: {
      alignSelf: "flex-end",
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    tutorialSkipText: {
      fontSize: 14,
      color: colors.textLight || "#999999",
    },
    tutorialNavigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    tutorialPrevButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: "transparent",
    },
    tutorialPrevText: {
      fontSize: 16,
      color: colors.text || "#555555",
      fontWeight: "500",
    },
    tutorialNextButton: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 24,
      backgroundColor: colors.primary || "#2F80ED",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    tutorialCompleteButton: {
      backgroundColor: colors.success || "#27AE60",
    },
    tutorialNextText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.tutorialOverlay}>
        <View style={styles.tutorialModal}>
          {/* Barra de progresso */}
          <View style={styles.tutorialProgressBar}>
            <View 
              style={[
                styles.tutorialProgressFill,
                { width: `${progress}%` }
              ]} 
            />
          </View>

          {/* Conteúdo */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tutorialScrollContent}
          >
            <View style={styles.tutorialContent}>
              {/* Emoji/Ícone */}
              <Text style={styles.tutorialEmoji}>{step.emoji}</Text>

              {/* Título */}
              <Text style={[styles.tutorialTitle, dynamicStyles.title]}>
                {step.title}
              </Text>

              {/* Descrição */}
              <Text style={[styles.tutorialDescription, dynamicStyles.text]}>
                {step.description}
              </Text>

              {/* Indicador de passos */}
              <View style={styles.tutorialDots}>
                {steps.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tutorialDot,
                      index === currentStep && styles.tutorialDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Botões */}
          <View style={styles.tutorialButtons}>
            <TouchableOpacity
              style={styles.tutorialSkipButton}
              onPress={skipTutorial}
            >
              <Text style={[styles.tutorialSkipText, dynamicStyles.text]}>
                {isLastStep ? "Concluir" : "Pular"}
              </Text>
            </TouchableOpacity>

            <View style={styles.tutorialNavigation}>
              {!isFirstStep && (
                <TouchableOpacity
                  style={styles.tutorialPrevButton}
                  onPress={prevStep}
                >
                  <Text style={[styles.tutorialPrevText, dynamicStyles.text]}>
                    ← Voltar
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.tutorialNextButton,
                  isLastStep && styles.tutorialCompleteButton,
                  !isFirstStep && { flex: 1 }
                ]}
                onPress={nextStep}
              >
                <Text style={[styles.tutorialNextText, dynamicStyles.button]}>
                  {isLastStep ? "🚀 Começar" : "Próximo →"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}