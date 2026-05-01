package com.cajaclara.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio de chat para el asistente de Caja Clara.
 *
 * Implementación actual: respuestas basadas en reglas locales.
 * Para integrar con un LLM externo (Gemini, OpenAI, etc.),
 * reemplazar el método processMessage con la llamada al servicio deseado.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    /**
     * Procesa el mensaje del usuario y devuelve una respuesta.
     * Soporta consultas sobre productos, ventas, caja, servicios y afiliados.
     *
     * Para integrar con Gemini/OpenAI, reemplazar este método con:
     * - RestTemplate/WebClient para llamar a la API del LLM
     * - O usar el SDK de Google GenAI si se ejecuta en entorno Node.js
     */
    public String processMessage(String message) {
        String lower = message.toLowerCase().trim();

        // Saludos
        if (lower.contains("hola") || lower.contains("buenos días") || lower.contains("buenas")) {
            return "¡Hola! Soy el asistente de Caja Clara. ¿En qué puedo ayudarte? Puedes preguntarme sobre:\n" +
                    "• Productos y stock\n• Ventas y transacciones\n• Caja y cierres\n• Servicios y pedidos\n• Afiliados y puntos";
        }

        // Productos
        if (lower.contains("producto") || lower.contains("inventario") || lower.contains("stock")) {
            if (lower.contains("bajo") || lower.contains("agotado") || lower.contains("crítico")) {
                return "Para ver los productos con stock bajo, ve a la sección de Inventario. " +
                        "Los productos se marcan automáticamente como 'Stock Bajo' cuando tienen menos de 10 unidades, " +
                        "y como 'Agotado' cuando llegan a 0. También puedes ver alertas en el Dashboard.";
            }
            return "Puedes gestionar productos desde la sección de Inventario. Allí puedes:\n" +
                    "• Agregar nuevos productos con código, nombre, categoría, precio y stock\n" +
                    "• Filtrar por categoría (Papelería, Regalos, Fotocopias, Dulces)\n" +
                    "• Ver el estado de cada producto (Saludable, Stock Bajo, Agotado)";
        }

        // Ventas
        if (lower.contains("venta") || lower.contains("vender") || lower.contains("cobrar")) {
            return "Para registrar una venta:\n" +
                    "1. Asegúrate de que la caja esté abierta\n" +
                    "2. Ve a la sección de Ventas\n" +
                    "3. Busca o filtra productos por categoría\n" +
                    "4. Agrega productos al carrito\n" +
                    "5. Selecciona el método de pago (Efectivo, Transferencia o Tarjeta)\n" +
                    "6. Confirma la venta\n\n" +
                    "Recuerda: el stock se descuenta automáticamente al vender.";
        }

        // Caja
        if (lower.contains("caja") || lower.contains("cierre") || lower.contains("cuadre") || lower.contains("apertura")) {
            if (lower.contains("abrir") || lower.contains("apertura")) {
                return "Para abrir la caja:\n" +
                        "1. Ve a la sección de Caja\n" +
                        "2. Ingresa la base inicial en efectivo\n" +
                        "3. Confirma la apertura\n\n" +
                        "Solo puede haber una sesión de caja abierta a la vez. Las ventas requieren caja abierta.";
            }
            if (lower.contains("cerrar") || lower.contains("cierre") || lower.contains("cuadre")) {
                return "Para cerrar la caja:\n" +
                        "1. Ve a la sección de Caja\n" +
                        "2. Haz clic en 'Cerrar Caja'\n" +
                        "3. Ingresa el total real contado en efectivo\n" +
                        "4. Opcionalmente agrega observaciones\n\n" +
                        "El sistema calculará automáticamente:\n" +
                        "• Total esperado = Base inicial + Ingresos - Egresos\n" +
                        "• Diferencia = Total real - Total esperado";
            }
            return "La sección de Caja te permite:\n" +
                    "• Abrir sesión con base inicial\n" +
                    "• Registrar ingresos y egresos extras\n" +
                    "• Ver todas las transacciones de la sesión\n" +
                    "• Cerrar sesión con cuadre de caja\n\n" +
                    "Recuerda: solo puede haber una sesión abierta a la vez.";
        }

        // Servicios
        if (lower.contains("servicio") || lower.contains("pedido") || lower.contains("ancheta") || lower.contains("abono")) {
            return "La sección de Servicios gestiona pedidos personalizados:\n" +
                    "• Crear pedidos con presupuesto y anticipo inicial\n" +
                    "• Registrar abonos parciales\n" +
                    "• Cambiar estado: Pendiente → En Proceso → Entregado\n\n" +
                    "Los abonos requieren que la caja esté abierta y generan un ingreso automático. " +
                    "Cuando el total de abonos alcanza el presupuesto, el servicio se marca como Entregado.";
        }

        // Afiliados
        if (lower.contains("afiliado") || lower.contains("puntos") || lower.contains("fidelidad") || lower.contains("oro") || lower.contains("plata") || lower.contains("bronce")) {
            return "El programa de afiliados tiene 3 niveles:\n" +
                    "🥇 Oro: 5,000+ puntos\n" +
                    "🥈 Plata: 2,000-4,999 puntos\n" +
                    "🥉 Bronce: 0-1,999 puntos\n\n" +
                    "Cada 1,000 puntos equivalen a 1 recompensa. Puedes gestionar afiliados desde la sección correspondiente.";
        }

        // Ayuda
        if (lower.contains("ayuda") || lower.contains("help") || lower.contains("qué puedes")) {
            return "Puedo ayudarte con:\n" +
                    "• 📦 Productos e inventario\n" +
                    "• 💰 Ventas y cobros\n" +
                    "• 🏦 Caja y cuadres\n" +
                    "• 🔧 Servicios y pedidos\n" +
                    "• 👥 Afiliados y puntos\n" +
                    "• 📊 Reportes\n\n" +
                    "Simplemente pregúntame sobre cualquiera de estos temas.";
        }

        // Respuesta por defecto
        return "No estoy seguro de cómo ayudarte con eso. Puedo asistirte con:\n" +
                "• Productos e inventario\n• Ventas\n• Caja\n• Servicios\n• Afiliados\n\n" +
                "Intenta ser más específico o pregunta 'ayuda' para ver las opciones disponibles.";
    }
}
