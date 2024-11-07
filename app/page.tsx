"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const formSchema = z.object({
    cep: z
      .string()
      .length(8, {
        message: "CEP deve conter 8 caracteres.",
      })
      .regex(/^\d+$/, { message: "CEP deve conter apenas números." }),
    logradouro: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      cep: "",
      logradouro: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  function download(content: string, fileName: string, contentType: string) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function onSubmit() {
    const jsonData = JSON.stringify(form.getValues());
    download(jsonData, "cep.txt", "text/plain");
  }

  function resetForm() {
    form.reset();
  }

  async function getCep() {
    if (form.formState.isValid) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${form.getValues("cep")}/json/`
        );
        const json = await response.json();
        if (json) {
          form.setValue("logradouro", json.logradouro);
          form.setValue("complemento", json.complemento);
          form.setValue("bairro", json.bairro);
          form.setValue("cidade", json.localidade);
          form.setValue("estado", json.estado);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <main className="max-w-md mx-auto mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="CEP"
                    {...field}
                    onBlur={getCep}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Logradouro" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Complemento" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Bairro" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Cidade" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Estado" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-x-4">
            <Button onClick={resetForm}>Limpar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
