import os
import asyncio
import logging
import resend
from dotenv import load_dotenv
from pathlib import Path

# Cargar variables de entorno
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# Configurar Resend
resend.api_key = os.environ.get('RESEND_API_KEY', '')

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.sender_email = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
        self.api_key = os.environ.get('RESEND_API_KEY', '')
        
        if not self.api_key:
            logger.warning("RESEND_API_KEY not configured")
    
    async def send_quote_email(
        self, 
        recipient_email: str, 
        recipient_name: str,
        quote_id: str,
        service_type: str,
        total_price: float,
        pdf_path: str = None
    ) -> dict:
        """
        Envía email con cotización
        
        Args:
            recipient_email: Email del destinatario
            recipient_name: Nombre del destinatario
            quote_id: ID de la cotización
            service_type: Tipo de servicio
            total_price: Precio total
            pdf_path: Path al archivo PDF (opcional)
            
        Returns:
            dict: Resultado del envío
        """
        
        # Mapeo de servicios
        service_names = {
            'volteo': 'Volteo',
            'retroexcavadora': 'Retroexcavadora 420F 4x4',
            'nivelacion': 'Nivelación de Terrenos',
            'apertura': 'Apertura de Caminos',
            'acarreos': 'Acarreos'
        }
        
        service_name = service_names.get(service_type, service_type)
        
        # Crear el contenido HTML del email
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #1a5336 0%, #2d7a52 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e0e0e0;
                }}
                .greeting {{
                    font-size: 18px;
                    color: #1a5336;
                    margin-bottom: 20px;
                }}
                .info-box {{
                    background: #f8f9fa;
                    border-left: 4px solid #c9a961;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .info-item {{
                    margin: 10px 0;
                }}
                .info-item strong {{
                    color: #1a5336;
                }}
                .price-box {{
                    background: linear-gradient(135deg, #1a5336 0%, #2d7a52 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
                .price-box .amount {{
                    font-size: 36px;
                    font-weight: bold;
                    color: #c9a961;
                }}
                .cta-button {{
                    display: inline-block;
                    background: #c9a961;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
                .footer {{
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                    font-size: 14px;
                    color: #666;
                }}
                .social-links {{
                    margin: 15px 0;
                }}
                .social-links a {{
                    color: #1a5336;
                    text-decoration: none;
                    margin: 0 10px;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏗️ Shíntergy</h1>
                <p style="margin: 10px 0 0 0;">Soluciones en Construcción</p>
            </div>
            
            <div class="content">
                <p class="greeting">¡Hola {recipient_name}!</p>
                
                <p>Gracias por tu interés en nuestros servicios. Hemos generado tu cotización personalizada.</p>
                
                <div class="info-box">
                    <div class="info-item">
                        <strong>📋 No. Cotización:</strong> {quote_id}
                    </div>
                    <div class="info-item">
                        <strong>🚜 Servicio:</strong> {service_name}
                    </div>
                </div>
                
                <div class="price-box">
                    <p style="margin: 0; font-size: 14px;">Total Estimado</p>
                    <p class="amount">${total_price:,.2f} MXN</p>
                    <p style="margin: 0; font-size: 12px;">+ IVA incluido</p>
                </div>
                
                <p><strong>📄 Adjunto encontrarás el PDF detallado</strong> con:</p>
                <ul>
                    <li>Desglose completo de precios</li>
                    <li>Términos y condiciones</li>
                    <li>Información de contacto</li>
                    <li>Servicios adicionales incluidos</li>
                </ul>
                
                <p>Si tienes alguna pregunta o deseas proceder con la renta, no dudes en contactarnos:</p>
                
                <div style="text-align: center;">
                    <a href="https://wa.me/52123456789" class="cta-button">
                        💬 Contactar por WhatsApp
                    </a>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    <strong>Datos de contacto:</strong><br>
                    📞 Teléfono: +52 123 456 7890<br>
                    📧 Email: contacto@shintergy.com<br>
                    📍 México
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Shíntergy - Soluciones en Construcción</strong></p>
                <p>Renta de Maquinaria Pesada y Servicios de Obra</p>
                
                <div class="social-links">
                    <a href="https://instagram.com/shintergy">Instagram</a> |
                    <a href="https://facebook.com/shintergy">Facebook</a> |
                    <a href="https://tiktok.com/@shintergy">TikTok</a>
                </div>
                
                <p style="font-size: 12px; color: #999; margin-top: 15px;">
                    Esta cotización es válida por 15 días.<br>
                    © 2025 Shíntergy. Todos los derechos reservados.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Preparar parámetros del email
        params = {
            "from": self.sender_email,
            "to": [recipient_email],
            "subject": f"Tu Cotización Shíntergy - {service_name} (#{quote_id})",
            "html": html_content
        }
        
        # Adjuntar PDF si existe
        if pdf_path and os.path.exists(pdf_path):
            try:
                import base64
                with open(pdf_path, 'rb') as f:
                    pdf_content = base64.b64encode(f.read()).decode('utf-8')
                
                params["attachments"] = [{
                    "filename": f"cotizacion_shintergy_{quote_id}.pdf",
                    "content": pdf_content
                }]
            except Exception as e:
                logger.error(f"Error reading PDF file: {e}")
        
        try:
            # Enviar email de forma asíncrona
            email = await asyncio.to_thread(resend.Emails.send, params)
            
            logger.info(f"Email sent successfully to {recipient_email}")
            
            return {
                "success": True,
                "email_id": email.get("id"),
                "message": f"Email sent to {recipient_email}"
            }
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to send email"
            }
    
    async def send_notification_email(self, quote_data: dict) -> dict:
        """
        Envía notificación interna cuando se recibe una nueva cotización
        
        Args:
            quote_data: Datos de la cotización
            
        Returns:
            dict: Resultado del envío
        """
        admin_email = os.environ.get('ADMIN_EMAIL', 'contacto@shintergy.com')
        
        contact = quote_data.get('contact_info', {})
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .header {{ background: #1a5336; color: white; padding: 20px; }}
                .content {{ padding: 20px; }}
                .info {{ background: #f5f5f5; padding: 15px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>🔔 Nueva Cotización Recibida</h2>
            </div>
            <div class="content">
                <div class="info">
                    <p><strong>Cliente:</strong> {contact.get('name', 'N/A')}</p>
                    <p><strong>Email:</strong> {contact.get('email', 'N/A')}</p>
                    <p><strong>Teléfono:</strong> {contact.get('phone', 'N/A')}</p>
                    <p><strong>Servicio:</strong> {quote_data.get('service_type', 'N/A')}</p>
                    <p><strong>Duración:</strong> {quote_data.get('rental_duration', 'N/A')}</p>
                    <p><strong>Ubicación:</strong> {quote_data.get('location', 'N/A')}</p>
                    <p><strong>Total:</strong> ${quote_data.get('total_price', 0):,.2f} MXN</p>
                </div>
                <p>Por favor, da seguimiento a esta cotización.</p>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": self.sender_email,
            "to": [admin_email],
            "subject": f"Nueva Cotización - {contact.get('name', 'Cliente')}",
            "html": html_content
        }
        
        try:
            email = await asyncio.to_thread(resend.Emails.send, params)
            return {"success": True, "email_id": email.get("id")}
        except Exception as e:
            logger.error(f"Failed to send notification email: {e}")
            return {"success": False, "error": str(e)}
