import { CheckCircle2, Send, X, Download, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { chatQuestions } from '../data/mock';
import { useContent } from '../context/ContentContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const ChatWidget = ({ isOpen, onClose }) => {
  const { content } = useContent();
  const companyInfo = content.company;
  const [messages, setMessages] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('welcome');
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quoteResult, setQuoteResult] = useState(null); // {quote_id, total_price, pdf_url, customer_phone}
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(chatQuestions[0].text);
      setTimeout(() => {
        setCurrentQuestionId('rental_duration');
        showCurrentQuestion('rental_duration');
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text, delay = 500) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text, timestamp: new Date() }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const showCurrentQuestion = (questionId) => {
    const question = chatQuestions.find((q) => q.id === questionId);
    if (question) addBotMessage(question.text, 800);
  };

  const handleOptionClick = (option) => {
    const currentQuestion = chatQuestions.find((q) => q.id === currentQuestionId);

    if (currentQuestion.type === 'multi-select') {
      setSelectedOptions((prev) =>
        prev.includes(option.value) ? prev.filter((v) => v !== option.value) : [...prev, option.value]
      );
    } else {
      addUserMessage(option.label);
      setUserResponses((prev) => ({ ...prev, [currentQuestionId]: option.value }));
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (option.next) {
          setCurrentQuestionId(option.next);
          showCurrentQuestion(option.next);
        }
      }, 800);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const currentQuestion = chatQuestions.find((q) => q.id === currentQuestionId);
    addUserMessage(inputValue);
    setUserResponses((prev) => ({ ...prev, [currentQuestionId]: inputValue }));
    setInputValue('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (currentQuestion.next) {
        setCurrentQuestionId(currentQuestion.next);
        showCurrentQuestion(currentQuestion.next);
      }
    }, 800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    addUserMessage(`${data.name} · ${data.phone}`);
    setUserResponses((prev) => ({ ...prev, contact_info: data }));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      generateQuoteSummary({ ...userResponses, contact_info: data });
    }, 1200);
  };

  const generateQuoteSummary = async (responses) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    addBotMessage('⏳ Generando tu cotización en PDF...', 400);

    try {
      const response = await fetch(`${BACKEND_URL}/api/quotes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: 'retroexcavadora',
          rental_duration: responses.rental_duration,
          additional_services: [],
          location: responses.location,
          contact_info: responses.contact_info,
        }),
      });

      if (!response.ok) throw new Error('Error al generar cotización');
      const data = await response.json();

      const pdfUrl = `${BACKEND_URL}/api/quotes/${data.quote_id}/pdf`;
      const summary = `✅ ¡Cotización lista!

📋 No. ${data.quote_id.slice(0, 8).toUpperCase()}
💰 Total: $${data.total_price.toLocaleString('es-MX')} MXN (IVA incluido)

Puedes descargar el PDF o enviarlo a tu WhatsApp con los botones de abajo. 👇`;

      addBotMessage(summary, 1200);

      setQuoteResult({
        quote_id: data.quote_id,
        total_price: data.total_price,
        pdf_url: pdfUrl,
        customer_phone: responses.contact_info.phone,
      });

      toast.success('¡Cotización generada!');
    } catch (error) {
      console.error('Error generating quote:', error);
      addBotMessage(
        '❌ Hubo un error. Por favor inténtalo de nuevo o contáctanos por WhatsApp.',
        800
      );
      toast.error('Error al generar cotización');
    }
  };

  const downloadPdf = () => {
    if (!quoteResult?.pdf_url) return;
    window.open(quoteResult.pdf_url, '_blank');
  };

  const sendToWhatsApp = (toCompany = false) => {
    if (!quoteResult) return;
    // Sanitize digits only from user phone
    const userDigits = (quoteResult.customer_phone || '').replace(/[^0-9]/g, '');
    const targetDigits = toCompany ? companyInfo.whatsappDigits : userDigits;

    if (!targetDigits || targetDigits.length < 10) {
      toast.error('Número de teléfono inválido');
      return;
    }
    // If user-provided number lacks country code, prepend MX 52
    const finalNumber = targetDigits.startsWith('52')
      ? targetDigits
      : `52${targetDigits}`;

    const msg = encodeURIComponent(
      `Hola, esta es mi cotización Shíntergy:

📋 No. ${quoteResult.quote_id.slice(0, 8).toUpperCase()}
💰 Total: $${quoteResult.total_price.toLocaleString('es-MX')} MXN (IVA incluido)

📎 PDF: ${quoteResult.pdf_url}`
    );
    window.open(`https://wa.me/${finalNumber}?text=${msg}`, '_blank');
  };

  const currentQuestion = chatQuestions.find((q) => q.id === currentQuestionId);
  const showFinalActions = !!quoteResult;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 animate-in fade-in slide-in-from-bottom-8 duration-300"
      data-testid="chat-widget"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:w-[450px] h-[90vh] md:h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a5336] to-[#143f28] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={companyInfo.logo}
                alt="Shíntergy"
                className="h-12 w-12 rounded-full bg-white p-1 object-contain"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg">Shíntergy · Cotizador</h3>
              <p className="text-xs text-gray-200">Te respondo en segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="chat-close"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-[#1a5336] text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <span
                  className={`text-xs ${message.type === 'user' ? 'text-gray-200' : 'text-gray-500'} mt-1 block`}
                >
                  {message.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input / Final Actions */}
        <div className="bg-white border-t p-4">
          {showFinalActions ? (
            <div className="space-y-2.5" data-testid="chat-final-actions">
              <Button
                onClick={downloadPdf}
                data-testid="chat-download-pdf"
                className="w-full bg-[#1a5336] hover:bg-[#143f28] text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
              <Button
                onClick={() => sendToWhatsApp(true)}
                data-testid="chat-send-company"
                className="w-full bg-[#25D366] hover:bg-[#1fb358] text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar a Shíntergy y agendar
              </Button>
              <p className="text-[11px] text-gray-500 text-center pt-1">
                El PDF queda guardado y puedes compartirlo con quien necesites.
              </p>
            </div>
          ) : (
            <>
              {currentQuestion?.type === 'options' && (
                <div className="grid grid-cols-1 gap-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      variant="outline"
                      data-testid={`chat-option-${option.value}`}
                      className="justify-start hover:bg-[#1a5336]/5 hover:border-[#1a5336] transition-all duration-200"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion?.type === 'multi-select' && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      variant="outline"
                      className={`w-full justify-start ${
                        selectedOptions.includes(option.value)
                          ? 'bg-[#1a5336] text-white border-[#1a5336]'
                          : 'hover:bg-[#1a5336]/5 hover:border-[#1a5336]'
                      } transition-all duration-200`}
                    >
                      <CheckCircle2
                        className={`mr-2 h-4 w-4 ${
                          selectedOptions.includes(option.value) ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion?.type === 'input' && (
                <form onSubmit={handleInputSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    data-testid="chat-input-text"
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-[#1a5336] hover:bg-[#143f28] text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}

              {currentQuestion?.type === 'form' && (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  {currentQuestion.fields.map((field) => (
                    <Input
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.label}
                      required={field.required}
                      data-testid={`chat-field-${field.name}`}
                      className="w-full"
                    />
                  ))}
                  <Button
                    type="submit"
                    data-testid="chat-submit-form"
                    className="w-full bg-[#1a5336] hover:bg-[#143f28] text-white"
                  >
                    Generar cotización
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
