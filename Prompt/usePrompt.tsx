import React, { useState, ReactElement, useEffect } from 'react';
import Prompt from './Prompt';
import { PromptOptions, PromptResponse } from './Types';
import { View } from 'react-native';

/**
 * Hook para pedir un contenedor de Prompts, y una función 'prompt' para 
 * llamar prompts que devuelvan promesas que resuelvan la respuesta del usuario.
 * @example
 *  const [prompts, prompt] = usePrompt();
 *  
 *  const askName = () =>
 *  {
 *      const prompt_options = {
 *          title: 'We need your name',
 *          input: 'Write your name here...',
 *          actions: [
 *              [
 *                  {
 *                      title: 'OK',
 *                      value: 'OK,
 *                  },{
 *                      title: 'CANCEL',
 *                      value: 'CANCEL,
 *                  }
 *              ]
 *          ]
 *      }
 * 
 *      prompt(prompt_options)
 *      .then(res => console.log(res))
 *      .catch(err => console.log(err))
 *  }
 */
const usePrompt = () : [Array<ReactElement>, (options: PromptOptions|string) => Promise<PromptResponse>] =>
{

    const initialPrompts:Array<ReactElement> = [];

    const [prompts, setPrompts] = useState(initialPrompts);

    const prompt = (options:PromptOptions|string) : Promise<PromptResponse> => new Promise<PromptResponse>((res, rej) =>
    {
        let key = Math.random()*99999;
        while (prompts.find(prompt => prompt.key === key)) key = Math.random()*99999;
        const prompt =
            <Prompt
            key={key}
            options={options}
            onSubmit={(value:PromptResponse) => {
                res(value);
                setPrompts([...(prompts.filter(prompt => prompt.key !== key))]);
            }} />;
        setPrompts([...prompts, prompt]);
    });

    return [prompts, prompt];
}

export default usePrompt;