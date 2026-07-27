import re

file_path = r"c:\Users\ivano\Downloads\D-n-MimiBot-main\Website-Mini-Bot\src\app\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove Icon3D import
content = re.sub(r"import \{ Icon3D, type Icon3DName \} from '@/components/ui/icon3d';\n", "", content)

# Add Shield, Wallet to lucide imports
content = content.replace("  Bot,\n} from 'lucide-react';", "  Bot,\n  Shield,\n  Wallet,\n} from 'lucide-react';")

# Fix services type
content = content.replace("icon: Icon3DName;", "icon: React.ElementType;")

# Fix services array
content = content.replace("icon: 'music',", "icon: Music,")
content = content.replace("ring: 'border-mimi-green/25 bg-mimi-green/10',", "ring: 'border-mimi-green/25 bg-mimi-green/10 text-mimi-green',")

content = content.replace("icon: 'shield',", "icon: Shield,")
content = content.replace("ring: 'border-mimi-purple/25 bg-mimi-purple/10',", "ring: 'border-mimi-purple/25 bg-mimi-purple/10 text-mimi-purple',")

content = content.replace("icon: 'money',", "icon: Wallet,")
content = content.replace("ring: 'border-mimi-cyan/25 bg-mimi-cyan/10',", "ring: 'border-mimi-cyan/25 bg-mimi-cyan/10 text-mimi-cyan',")

content = content.replace("icon: 'dashboard',", "icon: LayoutDashboard,")
content = content.replace("ring: 'border-mimi-amber/25 bg-mimi-amber/10',", "ring: 'border-mimi-amber/25 bg-mimi-amber/10 text-mimi-amber',")

# Fix JSX usages
content = content.replace('<Icon3D name="sparkles" size={20} />', '<Sparkles className="h-5 w-5" />')
content = content.replace('<Icon3D name="dashboard" size={20} />', '<LayoutDashboard className="h-5 w-5" />')
content = content.replace('<Icon3D name="star" size={16} />', '<Star className="h-4 w-4" />')
content = content.replace('<Icon3D name={s.icon} size={40} />', '<s.icon className="h-10 w-10" />')
content = content.replace('<Icon3D name="heart" size={16} />', '<Heart className="h-4 w-4" />')
content = content.replace('<Icon3D name="rocket" size={18} />', '<Rocket className="h-[18px] w-[18px]" />')
content = content.replace('<Icon3D name="robot" size={18} />', '<Bot className="h-[18px] w-[18px]" />')
content = content.replace('<Icon3D name="robot" size={24} />', '<Bot className="h-6 w-6" />')
content = content.replace('<Icon3D name="sparkles" size={16} />', '<Sparkles className="h-4 w-4" />')
content = content.replace('<Icon3D name="rocket" size={40} />', '<Rocket className="h-10 w-10 text-mimi-green" />')
content = content.replace('<Icon3D name="robot" size={40} />', '<Bot className="h-10 w-10 text-mimi-purple" />')
content = content.replace('<Icon3D name="sparkles" size={24} />', '<Sparkles className="h-6 w-6" />')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced successfully")
