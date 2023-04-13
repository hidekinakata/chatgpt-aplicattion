import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export default class OAISimulation {
  response: string = `Para calcular pi em Python com uma precisão escolhida pelo usuário, podemos usar a biblioteca decimal e a fórmula de Bailey-Borwein-Plouffe (BBP):

\`\`\`
from decimal import *

def pi(precision):
    getcontext().prec = precision
    pi = Decimal(0)
    k = 0
    while True:
        term_1 = Decimal(4)/(8*k+1)
        term_2 = Decimal(2)/(8*k+4)
        term_3 = Decimal(1)/(8*k+5)
        term_4 = Decimal(1)/(8*k+6)
        current_term = term_1 - term_2 - term_3 - term_4
        if current_term == 0:
            break
        pi += (current_term * Decimal(1/16)**k)
        k += 1
    return pi
\`\`\`

Este código define a função \`pi(precision)\` que recebe como parâmetro a precisão desejada pelo usuário. Em seguida, a precisão é configurada para a biblioteca decimal usando \`getcontext().prec\`. 

Em seguida, a função segue a fórmula BBP para aproximar o valor de pi. O loop while percorre os termos e o valor de k é incrementado. A precisão da representação decimal é ajustada dinamicamente à medida que mais e mais termos são somados.

Por fim, a função retorna o valor de pi com a precisão desejada.`;

  counter = 0;

  async read() {
    await new Promise((f) => setTimeout(f, 10));
    let chunk = this.response.slice(this.counter, this.counter + 4);
    this.counter += 4;
    return {
      value: chunk,
      done: this.counter > this.response.length,
    };
  }
}
