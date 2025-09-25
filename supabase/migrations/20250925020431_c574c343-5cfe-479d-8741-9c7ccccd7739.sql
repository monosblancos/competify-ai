-- Create business chat sessions table for the business chatbot
CREATE TABLE public.business_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  company_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for business chat sessions (open access for lead generation)
CREATE POLICY "Anyone can create business chat sessions" 
ON public.business_chat_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view business chat sessions" 
ON public.business_chat_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update business chat sessions" 
ON public.business_chat_sessions 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_chat_sessions_updated_at
BEFORE UPDATE ON public.business_chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();