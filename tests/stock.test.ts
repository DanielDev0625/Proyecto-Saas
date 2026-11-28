import { describe, expect, it } from "vitest";
// Ruta relativa: en esta rama Vitest no tiene configurado el atajo "@/".
import { necesitaReposicion, promedioDiario } from "../lib/stock";

describe("promedioDiario", () => {
  it("devuelve 0 si la lista está vacía", () => {
    expect(promedioDiario([])).toBe(0);
  });

  it("calcula el promedio de unidades por día", () => {
    expect(promedioDiario([4, 6, 2])).toBe(4);
  });

  it("cuenta los días sin ventas", () => {
    expect(promedioDiario([0, 0, 9])).toBe(3);
  });

  it("puede dar decimales", () => {
    expect(promedioDiario([1, 2])).toBe(1.5);
  });
});

describe("necesitaReposicion", () => {
  it("pide reponer si el stock está justo en el mínimo", () => {
    expect(necesitaReposicion(5, 5)).toBe(true);
  });

  it("pide reponer si el stock está por debajo del mínimo", () => {
    expect(necesitaReposicion(3, 5)).toBe(true);
  });

  it("pide reponer si el stock no alcanza para 3 días al ritmo promedio", () => {
    // 4 por día × 3 días = 12; hay 10 (por encima del mínimo de 5, pero no alcanza)
    expect(necesitaReposicion(10, 5, 4)).toBe(true);
  });

  it("no pide reponer si el stock alcanza para los días de cobertura", () => {
    // 4 por día × 3 días = 12; hay 20
    expect(necesitaReposicion(20, 5, 4)).toBe(false);
  });

  it("no pide reponer si el stock cubre exactamente los días de cobertura", () => {
    expect(necesitaReposicion(12, 5, 4)).toBe(false);
  });

  it("sin promedio solo cuenta el mínimo", () => {
    expect(necesitaReposicion(6, 5)).toBe(false);
  });

  it("respeta otros días de cobertura", () => {
    // 4 por día × 7 días = 28; hay 20
    expect(necesitaReposicion(20, 5, 4, 7)).toBe(true);
  });
});
