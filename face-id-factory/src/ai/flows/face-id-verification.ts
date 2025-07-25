'use server';

/**
 * @fileOverview Verifies the identity of a user via Face ID for machine access.
 *
 * - verifyFaceId - A function that handles the Face ID verification process.
 * - VerifyFaceIdInput - The input type for the verifyFaceId function.
 * - VerifyFaceIdOutput - The return type for the verifyFaceId function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyFaceIdInputSchema = z.object({
  livePhotoDataUri: z
    .string()
    .describe(
      "A live photo of the user's face from the camera, as a data URI."
    ),
  referencePhotoUrl: z
    .string()
    .describe(
      "The URL of the agent's reference photo from the database."
    ),
  problemType: z.enum(['matière', 'technique']).describe('The type of problem (matière or technique).'),
  userRole: z.enum(['qualité', 'maintenance']).describe('The role of the user (qualité or maintenance).'),
});
export type VerifyFaceIdInput = z.infer<typeof VerifyFaceIdInputSchema>;

const VerifyFaceIdOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the face in the live photo matches the face in the reference photo.'),
  isAuthorized: z.boolean().describe('Whether the user is authorized to unlock the machine based on their role and the problem type.'),
  message: z.string().describe('A message indicating the verification result in French.'),
});
export type VerifyFaceIdOutput = z.infer<typeof VerifyFaceIdOutputSchema>;

export async function verifyFaceId(input: VerifyFaceIdInput): Promise<VerifyFaceIdOutput> {
  return verifyFaceIdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyFaceIdPrompt',
  input: {schema: VerifyFaceIdInputSchema},
  output: {schema: VerifyFaceIdOutputSchema},
  prompt: `You are a Face ID verification system for a factory. Your response must be in French.

You must determine if the person in the live photo is the same person as in the reference photo.

You will also check if the user is authorized based on their role and the problem type.
- If the problem type is "matière", only users with the role "qualité" are authorized.
- If the problem type is "technique", only users with the role "maintenance" are authorized.

- Set isMatch to true if the faces are the same, false otherwise.
- Set isAuthorized to true ONLY if the faces match AND the user's role is correct for the problem type.
- Provide a clear message IN FRENCH explaining the outcome (e.g., "Vérification réussie, accès autorisé.", "Le visage ne correspond pas à la référence.", "Utilisateur non autorisé pour ce type de problème.", "Accès autorisé.").

Live Photo: {{media url=livePhotoDataUri}}
Reference Photo: {{media url=referencePhotoUrl}}
User Role: {{{userRole}}}
Problem Type: {{{problemType}}}
`,
});

const verifyFaceIdFlow = ai.defineFlow(
  {
    name: 'verifyFaceIdFlow',
    inputSchema: VerifyFaceIdInputSchema,
    outputSchema: VerifyFaceIdOutputSchema,
  },
  async input => {
    // First, check if the role is appropriate for the problem type.
    const roleMatchesProblem = 
        (input.userRole === 'qualité' && input.problemType === 'matière') ||
        (input.userRole === 'maintenance' && input.problemType === 'technique');

    if (!roleMatchesProblem) {
        // If the role is wrong, deny access immediately without calling the AI.
        return {
            isMatch: false, 
            isAuthorized: false,
            message: `Accès refusé. Le rôle '${input.userRole}' n'est pas autorisé pour un problème de type '${input.problemType}'.`
        };
    }

    // If the role is correct, proceed with AI face verification.
    const {output} = await prompt(input);
    
    // The prompt handles both face matching and authorization logic.
    // The final authorization depends on the AI's "isMatch" and "isAuthorized" results.
    return output!;
  }
);
