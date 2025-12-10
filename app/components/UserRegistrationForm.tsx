import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createUserAction } from '../actions'

export default async function UserRegistrationForm() {
  return (
    <form action={createUserAction} className="space-y-4 max-w-md mx-auto">
      <div>
        <Label>Name</Label>
        <Input name="name" required /> 
      </div>

      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>

      <div>
        <Label>Phone Number</Label>
        <Input name="phoneNumber" required />
      </div>

      <div>
        <Label>Swedish Personal Number</Label>
        <Input name="personalNumber" required />
      </div>

      <div>
        <Label>Address</Label>
        <Input name="address" required />
      </div>

      <Button type="submit">Register User</Button>
    </form>
  )
}
