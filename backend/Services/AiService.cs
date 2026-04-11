using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace backend.Services;
public class AiService
{
    private readonly ChatClient _chatClient;

    public AiService(string apiKey)
    {
        var options = new OpenAIClientOptions()
        {
            Endpoint = new Uri("https://api.groq.com/openai/v1")
        };
        var client = new OpenAIClient(new ApiKeyCredential(apiKey), options);

        _chatClient = client.GetChatClient("llama-3.3-70b-versatile");
    }

    public async Task<string> AskAsync(string prompt)
    {
        try
        {
            ChatCompletion completion = await _chatClient.CompleteChatAsync(prompt);
            return completion.Content[0].Text;
        }
        catch (Exception ex)
        {
            return $"Error: {ex.Message}";
        }
    }
}