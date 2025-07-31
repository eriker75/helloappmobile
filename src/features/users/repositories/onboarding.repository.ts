import api from "@/src/config/api";
export class OnboardingRepository {
  static async submitOnboardingWithImages(formData: FormData): Promise<any> {
    const res = await api.post("/onboarding/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
}
