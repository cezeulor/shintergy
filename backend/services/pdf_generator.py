from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import os
from pathlib import Path
import requests
from io import BytesIO


class PDFGenerator:
    def __init__(self):
        self.output_dir = Path("/tmp/generated_pdfs")
        self.output_dir.mkdir(exist_ok=True)
        self.logo_path = None  # Sin logo por ahora
    
    def _download_logo(self):
        """Descarga el logo de Shíntergy"""
        try:
            logo_url = "https://customer-assets.emergentagent.com/job_d72245cc-7a3d-410f-adc3-9ed7b232f5dd/artifacts/uukp3i9r_logo.jpg"
            response = requests.get(logo_url, timeout=10)
            if response.status_code == 200:
                with open(self.logo_path, 'wb') as f:
                    f.write(response.content)
        except Exception as e:
            print(f"Error downloading logo: {e}")
    
    def generate_quote_pdf(self, quote_data: dict) -> str:
        """
        Genera un PDF de cotización profesional
        
        Args:
            quote_data: Diccionario con los datos de la cotización
            
        Returns:
            str: Path al archivo PDF generado
        """
        quote_id = quote_data.get('id', 'N/A')
        filename = f"cotizacion_shintergy_{quote_id}.pdf"
        filepath = self.output_dir / filename
        
        # Crear el documento
        doc = SimpleDocTemplate(
            str(filepath),
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        # Contenedor para los elementos del PDF
        elements = []
        
        # Estilos
        styles = getSampleStyleSheet()
        
        # Estilo personalizado para el título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a5336'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Estilo para subtítulos
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1a5336'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        # Estilo para texto normal
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_LEFT
        )
        
        # Logo - Skipped (sin Pillow)
        elements.append(Spacer(1, 0.3*inch))
        
        # Título principal
        elements.append(Paragraph("COTIZACIÓN DE SERVICIOS", title_style))
        elements.append(Paragraph("Shíntergy - Soluciones en Construcción", normal_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Información de la cotización
        date_str = datetime.now().strftime("%d/%m/%Y %H:%M")
        elements.append(Paragraph(f"<b>Fecha:</b> {date_str}", normal_style))
        elements.append(Paragraph(f"<b>No. Cotización:</b> {quote_id}", normal_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Información del cliente
        elements.append(Paragraph("DATOS DEL CLIENTE", subtitle_style))
        contact = quote_data.get('contact_info', {})
        client_data = [
            ['Nombre:', contact.get('name', 'N/A')],
            ['Correo:', contact.get('email', 'N/A')],
            ['Teléfono:', contact.get('phone', 'N/A')],
            ['Ubicación:', quote_data.get('location', 'N/A')]
        ]
        
        client_table = Table(client_data, colWidths=[1.5*inch, 4.5*inch])
        client_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1a5336')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(client_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Detalles del servicio
        elements.append(Paragraph("DETALLES DEL SERVICIO", subtitle_style))
        
        # Mapeo de servicios
        service_names = {
            'volteo': 'Volteo',
            'retroexcavadora': 'Retroexcavadora 420F 4x4',
            'nivelacion': 'Nivelación de Terrenos',
            'apertura': 'Apertura de Caminos',
            'acarreos': 'Acarreos'
        }
        
        duration_names = {
            'day': 'Por Día',
            'week': 'Por Semana',
            'month': 'Por Mes'
        }
        
        service_name = service_names.get(quote_data.get('service_type', ''), quote_data.get('service_type', 'N/A'))
        duration_name = duration_names.get(quote_data.get('rental_duration', ''), quote_data.get('rental_duration', 'N/A'))
        
        service_details = [
            ['Servicio Solicitado:', service_name],
            ['Duración de Renta:', duration_name]
        ]
        
        service_table = Table(service_details, colWidths=[2*inch, 4*inch])
        service_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1a5336')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(service_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Servicios adicionales
        additional_services = quote_data.get('additional_services', [])
        if additional_services:
            elements.append(Paragraph("SERVICIOS ADICIONALES", subtitle_style))
            
            service_labels = {
                'gps': 'Rastreo GPS',
                'airtag': 'AirTag adicional',
                'seguro_extra': 'Seguro extendido'
            }
            
            for service in additional_services:
                label = service_labels.get(service, service)
                elements.append(Paragraph(f"• {label}", normal_style))
            
            elements.append(Spacer(1, 0.2*inch))
        
        # Desglose de precios
        elements.append(Paragraph("DESGLOSE DE PRECIOS", subtitle_style))
        
        base_price = quote_data.get('base_price', 0)
        gps_price = quote_data.get('gps_price', 0)
        airtag_price = quote_data.get('airtag_price', 0)
        insurance_price = quote_data.get('extra_insurance_price', 0)
        subtotal = base_price + gps_price + airtag_price + insurance_price
        iva = subtotal * 0.16
        total = subtotal + iva
        
        price_data = [
            ['CONCEPTO', 'PRECIO'],
            [f'{service_name} - {duration_name}', f'${base_price:,.2f}']
        ]
        
        if gps_price > 0:
            price_data.append(['Rastreo GPS', f'${gps_price:,.2f}'])
        if airtag_price > 0:
            price_data.append(['AirTag adicional', f'${airtag_price:,.2f}'])
        if insurance_price > 0:
            price_data.append(['Seguro extendido', f'${insurance_price:,.2f}'])
        
        price_data.append(['', ''])
        price_data.append(['Subtotal', f'${subtotal:,.2f}'])
        price_data.append(['IVA (16%)', f'${iva:,.2f}'])
        price_data.append(['TOTAL', f'${total:,.2f}'])
        
        price_table = Table(price_data, colWidths=[4*inch, 2*inch])
        price_table.setStyle(TableStyle([
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5336')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            # Body
            ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -4), 11),
            ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
            # Subtotal/IVA
            ('FONTNAME', (0, -3), (-1, -2), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, -3), (-1, -2), colors.HexColor('#1a5336')),
            # Total
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#c9a961')),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.whitesmoke),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 14),
            # Grid
            ('GRID', (0, 0), (-1, -4), 1, colors.grey),
            ('LINEABOVE', (0, -3), (-1, -3), 2, colors.HexColor('#1a5336')),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#c9a961')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
        ]))
        elements.append(price_table)
        elements.append(Spacer(1, 0.4*inch))
        
        # Términos y condiciones
        elements.append(Paragraph("TÉRMINOS Y CONDICIONES", subtitle_style))
        
        terms = [
            "1. La cotización es válida por 15 días a partir de la fecha de emisión.",
            "2. Los precios están sujetos a disponibilidad de maquinaria.",
            "3. El servicio de GPS tiene un costo adicional de $400 MXN mensuales aproximadamente.",
            "4. Toda la maquinaria está equipada con cortador de corriente para seguridad.",
            "5. El seguro está incluido en el precio de renta.",
            "6. Se requiere un depósito del 50% para confirmar la reserva.",
            "7. Los pagos se realizan en efectivo o transferencia bancaria.",
            "8. La maquinaria debe ser devuelta en las mismas condiciones en que fue entregada.",
            "9. Cualquier daño será cobrado al cliente según valoración.",
            "10. Los precios no incluyen combustible ni operador (opcional)."
        ]
        
        for term in terms:
            elements.append(Paragraph(term, normal_style))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Información de contacto
        elements.append(Paragraph("INFORMACIÓN DE CONTACTO", subtitle_style))
        contact_info = [
            "Teléfono: +52 123 456 7890",
            "Email: contacto@shintergy.com",
            "Ubicación: México",
            "",
            "Síguenos en redes sociales:",
            "Instagram: @shintergy | Facebook: /shintergy | TikTok: @shintergy"
        ]
        
        for info in contact_info:
            elements.append(Paragraph(info, normal_style))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        elements.append(Paragraph("Gracias por confiar en Shíntergy - Soluciones en Construcción y Renta de Maquinaria Pesada", footer_style))
        elements.append(Paragraph("www.shintergy.com", footer_style))
        
        # Construir el PDF
        doc.build(elements)
        
        return str(filepath)
